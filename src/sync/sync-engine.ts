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
	useEstadoSync.getState().setSincronizando(true);
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
		useEstadoSync.getState().setSincronizando(false);
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

const fechaIso = (d?: Date): string | undefined =>
	d ? d.toISOString().slice(0, 10) : undefined;

const pull = async (): Promise<void> => {
	const cursor = await leerCursor();
	const res = await api.cambios(cursor);

	await db.transaction(
		"rw",
		[
			db.escritos,
			db.carpetas,
			db.habitos,
			db.registrosHabito,
			db.listasObjetivo,
			db.itemsObjetivo,
		],
		async () => {
			for (const c of res.carpetas ?? []) {
				if (!c.clientId) continue;
				const local = await db.carpetas.get(c.clientId);
				if (local?.pendiente) continue;
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
				if (local?.pendiente) continue;
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

			for (const h of res.habitos ?? []) {
				if (!h.clientId) continue;
				const local = await db.habitos.get(h.clientId);
				if (local?.pendiente) continue;
				await db.habitos.put({
					clientId: h.clientId,
					serverId: h.id,
					nombre: h.nombre ?? "",
					tipo: h.tipo ?? 1,
					activo: h.activo ?? true,
					posicion: h.posicion ?? 0,
					metaMinutos: h.metaMinutos,
					version: h.version ?? 0,
					pendiente: false,
				});
			}

			for (const r of res.registrosHabito ?? []) {
				if (!r.clientId || !r.habitoClientId) continue;
				const local = await db.registrosHabito.get(r.clientId);
				if (local?.pendiente) continue;
				await db.registrosHabito.put({
					clientId: r.clientId,
					serverId: r.id,
					habitoClientId: r.habitoClientId,
					habitoId: r.habitoId,
					fecha: fechaIso(r.fecha) ?? local?.fecha ?? "",
					valorBooleano: r.valorBooleano,
					valorNumerico: r.valorNumerico,
					version: r.version ?? 0,
					pendiente: false,
				});
			}

			for (const l of res.listasObjetivo ?? []) {
				if (!l.clientId || l.tipo == null || !l.clavePeriodo) continue;
				await db.listasObjetivo.put({
					clientId: l.clientId,
					serverId: l.id,
					tipo: l.tipo,
					clavePeriodo: l.clavePeriodo,
					fechaInicio: l.fechaInicio?.toISOString?.(),
					fechaFin: l.fechaFin?.toISOString?.(),
					fechaCreacion: l.fechaCreacion?.toISOString?.(),
					version: l.version ?? 0,
				});
			}

			for (const i of res.itemsObjetivo ?? []) {
				if (!i.clientId || i.listaTipo == null || !i.listaClavePeriodo) continue;
				const local = await db.itemsObjetivo.get(i.clientId);
				if (local?.pendiente) continue;
				await db.itemsObjetivo.put({
					clientId: i.clientId,
					serverId: i.id,
					listaTipo: i.listaTipo,
					listaClavePeriodo: i.listaClavePeriodo,
					texto: i.texto ?? "",
					completado: i.completado ?? false,
					posicion: i.posicion ?? 0,
					fechaCompletado: i.fechaCompletado?.toISOString?.(),
					version: i.version ?? 0,
					pendiente: false,
				});
			}

			for (const t of res.eliminados ?? []) {
				if (!t.clientId) continue;
				if (t.tipoEntidad === "Escrito") await db.escritos.delete(t.clientId);
				if (t.tipoEntidad === "Carpeta") await db.carpetas.delete(t.clientId);
				if (t.tipoEntidad === "Habito") {
					await db.habitos.delete(t.clientId);
					await db.registrosHabito.where("habitoClientId").equals(t.clientId).delete();
				}
				if (t.tipoEntidad === "ItemObjetivo") await db.itemsObjetivo.delete(t.clientId);
			}
		},
	);

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

	await db.transaction(
		"rw",
		[db.escritos, db.carpetas, db.habitos, db.registrosHabito, db.itemsObjetivo, db.outbox],
		async () => {
			for (const r of res.resultados ?? []) {
				const op = ops.find((o) => o.clientOpId === r.clientOpId);
				if (!op) continue;

				if (r.estado === "aplicado" || r.estado === "duplicado") {
					await confirmarLocal(op, r.serverId, r.version);
					await db.outbox.delete(op.clientOpId);
				} else if (r.estado === "rechazado") {
					await marcarNoPendiente(op);
					await db.outbox.delete(op.clientOpId);
				} else {
					const intentos = op.intentos + 1;
					await db.outbox.put({ ...op, intentos, muerta: intentos >= 5 });
				}
			}
		},
	);
};

const confirmarLocal = async (op: OperacionOutbox, serverId?: number, version?: number) => {
	switch (op.entityType) {
	case "carpeta": {
		const local = await db.carpetas.get(op.clientEntityId);
		if (!local) return;
		await db.carpetas.put({
			...local,
			serverId: serverId ?? local.serverId,
			version: version ?? local.version,
			pendiente: false,
		});
		break;
	}
	case "habito": {
		const local = await db.habitos.get(op.clientEntityId);
		if (!local) return;
		await db.habitos.put({
			...local,
			serverId: serverId ?? local.serverId,
			version: version ?? local.version,
			pendiente: false,
		});
		break;
	}
	case "registroHabito": {
		const local = await db.registrosHabito.get(op.clientEntityId);
		if (!local) return;
		await db.registrosHabito.put({
			...local,
			serverId: serverId ?? local.serverId,
			version: version ?? local.version,
			pendiente: false,
		});
		break;
	}
	case "itemObjetivo": {
		const local = await db.itemsObjetivo.get(op.clientEntityId);
		if (!local) return;
		await db.itemsObjetivo.put({
			...local,
			serverId: serverId ?? local.serverId,
			version: version ?? local.version,
			pendiente: false,
		});
		break;
	}
	default: {
		const local = await db.escritos.get(op.clientEntityId);
		if (!local) return;
		await db.escritos.put({
			...local,
			serverId: serverId ?? local.serverId,
			version: version ?? local.version,
			pendiente: false,
		});
	}
	}
};

const marcarNoPendiente = async (op: OperacionOutbox) => {
	switch (op.entityType) {
	case "carpeta": {
		const local = await db.carpetas.get(op.clientEntityId);
		if (local) await db.carpetas.put({ ...local, pendiente: false });
		break;
	}
	case "habito": {
		const local = await db.habitos.get(op.clientEntityId);
		if (local) await db.habitos.put({ ...local, pendiente: false });
		break;
	}
	case "registroHabito": {
		const local = await db.registrosHabito.get(op.clientEntityId);
		if (local) await db.registrosHabito.put({ ...local, pendiente: false });
		break;
	}
	case "itemObjetivo": {
		const local = await db.itemsObjetivo.get(op.clientEntityId);
		if (local) await db.itemsObjetivo.put({ ...local, pendiente: false });
		break;
	}
	default: {
		const local = await db.escritos.get(op.clientEntityId);
		if (local) await db.escritos.put({ ...local, pendiente: false });
	}
	}
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
