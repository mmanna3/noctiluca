import { api } from "@/api/api";
import { SyncOpDTO, SyncPushDTO } from "@/api/clients";
import { db, guardarCursor, leerCursor, obtenerDeviceId } from "./db";
import { refrescarPendientes, useEstadoSync } from "./estado-sync";
import { OperacionOutbox } from "./tipos";

let enEjecucion = false;
let pendienteDeCorrer = false;

/** Encola una sincronización, coalesciendo llamadas mientras una está en curso. */
export const sincronizarPronto = (): void => {
	void sincronizar();
};

export const sincronizar = async (): Promise<void> => {
	if (enEjecucion) {
		pendienteDeCorrer = true;
		return;
	}
	if (typeof navigator !== "undefined" && !navigator.onLine) {
		await refrescarPendientes();
		return;
	}

	enEjecucion = true;
	try {
		await conLockDeLider(async () => {
			await push();
			await pull();
		});
		useEstadoSync.getState().setError(undefined);
	} catch (error) {
		// No perder el outbox ante errores (red, 401, etc.): quedan pendientes.
		useEstadoSync.getState().setError((error as Error)?.message ?? "Error de sincronización");
	} finally {
		enEjecucion = false;
		await refrescarPendientes();
		if (pendienteDeCorrer) {
			pendienteDeCorrer = false;
			void sincronizar();
		}
	}
};

/**
 * Garantiza que una sola pestaña ejecute el ciclo de sync a la vez (Web Locks).
 * Si otra pestaña ya lo tiene, esta no hace nada. Fallback: ejecuta directo.
 */
const conLockDeLider = async (fn: () => Promise<void>): Promise<void> => {
	if (typeof navigator !== "undefined" && "locks" in navigator) {
		await navigator.locks.request("noctiluca-sync", { ifAvailable: true }, async (lock) => {
			if (!lock) return;
			await fn();
		});
	} else {
		await fn();
	}
};

const pull = async (): Promise<void> => {
	const cursor = await leerCursor();
	const res = await api.cambios(cursor);

	await db.transaction("rw", db.escritos, db.carpetas, async () => {
		for (const c of res.carpetas ?? []) {
			if (!c.clientId) continue;
			const local = await db.carpetas.get(c.clientId);
			if (local?.pendiente) continue; // no pisar cambios locales sin sincronizar
			if (local?.serverId && local.version > (c.version ?? 0)) continue;
			await db.carpetas.put({
				clientId: c.clientId,
				serverId: c.id,
				titulo: c.titulo ?? "",
				version: c.version ?? 0,
				posicion: c.posicion,
				criterioDeOrden: c.criterioDeOrden,
				carpetaPadreId: c.carpetaPadreId ?? undefined,
				esSistema: c.esSistema,
				requiereAutenticacion: c.requiereAutenticacion,
				propositoCarpeta: c.propositoCarpeta ?? undefined,
			});
		}

		for (const e of res.escritos ?? []) {
			if (!e.clientId) continue;
			const local = await db.escritos.get(e.clientId);
			if (local?.pendiente) continue; // no pisar cambios locales sin sincronizar
			await db.escritos.put({
				clientId: e.clientId,
				serverId: e.id,
				titulo: e.titulo ?? "",
				cuerpo: e.cuerpo ?? "",
				carpetaClientId: e.carpetaClientId,
				carpetaId: e.carpetaId,
				version: e.version ?? 0,
				fechaHoraCreacion: e.fechaHoraCreacion?.toISOString?.() ?? undefined,
				fechaHoraEdicion: e.fechaHoraEdicion?.toISOString?.() ?? undefined,
				estaEnPapelera: e.estaEnPapelera ?? false,
				pendiente: false,
			});
		}

		for (const t of res.eliminados ?? []) {
			if (!t.clientId) continue;
			if (t.tipoEntidad === "Escrito") await db.escritos.delete(t.clientId);
			if (t.tipoEntidad === "Carpeta") await db.carpetas.delete(t.clientId);
		}
	});

	if (res.cursor != null) await guardarCursor(res.cursor);
};

const push = async (): Promise<void> => {
	const ops = await db.outbox.filter((o) => !o.muerta).toArray();
	if (ops.length === 0) return;

	const deviceId = await obtenerDeviceId();
	const dto = new SyncPushDTO({
		deviceId,
		operaciones: ops.map(
			(o) =>
				new SyncOpDTO({
					clientOpId: o.clientOpId,
					entityType: o.entityType,
					operation: o.operation,
					clientEntityId: o.clientEntityId,
					baseVersion: o.baseVersion,
					clientTimestamp: new Date(o.clientTimestamp),
					payload: o.payload,
				}),
		),
	});

	const res = await api.aplicar(dto);

	await db.transaction("rw", db.escritos, db.carpetas, db.outbox, async () => {
		for (const r of res.resultados ?? []) {
			const op = ops.find((o) => o.clientOpId === r.clientOpId);
			if (!op) continue;

			if (r.estado === "aplicado" || r.estado === "duplicado") {
				await confirmarLocal(op, r.serverId, r.version);
				await db.outbox.delete(op.clientOpId);
			} else if (r.estado === "rechazado") {
				// El servidor tenía una versión más nueva (LWW). Descartamos el cambio
				// local; el pull siguiente traerá el estado ganador.
				await marcarNoPendiente(op);
				await db.outbox.delete(op.clientOpId);
			} else {
				const intentos = op.intentos + 1;
				await db.outbox.put({ ...op, intentos, muerta: intentos >= 5 });
			}
		}
	});
};

const confirmarLocal = async (op: OperacionOutbox, serverId?: number, version?: number) => {
	if (op.entityType === "carpeta") {
		const local = await db.carpetas.get(op.clientEntityId);
		if (!local) return;
		await db.carpetas.put({
			...local,
			serverId: serverId ?? local.serverId,
			version: version ?? local.version,
			pendiente: false,
		});
		return;
	}
	const local = await db.escritos.get(op.clientEntityId);
	if (!local) return;
	await db.escritos.put({
		...local,
		serverId: serverId ?? local.serverId,
		version: version ?? local.version,
		pendiente: false,
	});
};

const marcarNoPendiente = async (op: OperacionOutbox) => {
	if (op.entityType === "carpeta") {
		const local = await db.carpetas.get(op.clientEntityId);
		if (local) await db.carpetas.put({ ...local, pendiente: false });
		return;
	}
	const local = await db.escritos.get(op.clientEntityId);
	if (local) await db.escritos.put({ ...local, pendiente: false });
};

/**
 * Arranca el motor: escucha conectividad/visibilidad, pide almacenamiento
 * persistente (evita que iOS borre IndexedDB) y dispara una sincronización.
 */
export const iniciarSync = (): void => {
	if (typeof window === "undefined") return;

	useEstadoSync.getState().setOnline(navigator.onLine);

	window.addEventListener("online", () => {
		useEstadoSync.getState().setOnline(true);
		void sincronizar();
	});
	window.addEventListener("offline", () => {
		useEstadoSync.getState().setOnline(false);
		void refrescarPendientes();
	});
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "visible") void sincronizar();
	});

	if (navigator.storage?.persist) void navigator.storage.persist();

	void refrescarPendientes();
	void sincronizar();
};
