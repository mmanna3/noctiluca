import { db } from "./db";
import { refrescarPendientes } from "./estado-sync";
import { nuevoId } from "./ids";
import { compactar } from "./outbox";
import { sincronizarPronto } from "./sync-engine";
import { CarpetaLocal, OperacionOutbox } from "./tipos";

const encolarCompactando = async (clientEntityId: string, op: OperacionOutbox): Promise<void> => {
	const pendientes = await db.outbox.where("clientEntityId").equals(clientEntityId).toArray();
	const compactadas = compactar(pendientes, op);
	await db.outbox.where("clientEntityId").equals(clientEntityId).delete();
	await db.outbox.bulkPut(compactadas);
};

/** Payload de upsert de carpeta que espera el backend (CarpetaSyncPayload). */
const payloadDeCarpeta = (c: CarpetaLocal, carpetaPadreClientId?: string) => ({
	titulo: c.titulo,
	requiereAutenticacion: c.requiereAutenticacion ?? false,
	posicion: c.posicion ?? 0,
	criterioDeOrden: c.criterioDeOrden ?? 1,
	carpetaPadreClientId,
	propositoCarpeta: c.propositoCarpeta,
});

/** Alta offline de una carpeta (o subcarpeta). Devuelve el clientId. */
export const crearCarpetaLocal = async (params: {
	titulo: string;
	carpetaPadreId?: number;
}): Promise<string> => {
	const clientId = nuevoId();

	let carpetaPadreClientId: string | undefined;
	if (params.carpetaPadreId !== undefined) {
		carpetaPadreClientId = (
			await db.carpetas.where("serverId").equals(params.carpetaPadreId).first()
		)?.clientId;
	}

	// Posición al final entre sus hermanas.
	const hermanas = await db.carpetas
		.filter((c) =>
			params.carpetaPadreId === undefined
				? c.carpetaPadreId === undefined || c.carpetaPadreId === null
				: c.carpetaPadreId === params.carpetaPadreId,
		)
		.toArray();
	const posicion = hermanas.reduce((max, c) => Math.max(max, c.posicion ?? 0), 0) + 1;

	const carpeta: CarpetaLocal = {
		clientId,
		titulo: params.titulo,
		version: 0,
		posicion,
		criterioDeOrden: 1,
		carpetaPadreId: params.carpetaPadreId,
		carpetaPadreClientId,
		esSistema: false,
		requiereAutenticacion: false,
		pendiente: true,
	};

	await db.transaction("rw", db.carpetas, db.outbox, async () => {
		await db.carpetas.put(carpeta);
		await encolarCompactando(clientId, {
			clientOpId: nuevoId(),
			entityType: "carpeta",
			operation: "upsert",
			clientEntityId: clientId,
			clientTimestamp: new Date().toISOString(),
			payload: payloadDeCarpeta(carpeta, carpetaPadreClientId),
			intentos: 0,
		});
	});

	await refrescarPendientes();
	void sincronizarPronto();
	return clientId;
};

/** Cambia el criterio de orden de una carpeta, offline-first. */
export const actualizarCriterioLocal = async (
	clientId: string,
	criterioDeOrden: number,
): Promise<void> => {
	await db.transaction("rw", db.carpetas, db.outbox, async () => {
		const actual = await db.carpetas.get(clientId);
		if (!actual) return;

		const actualizada: CarpetaLocal = {
			...actual,
			criterioDeOrden,
			pendiente: true,
		};
		await db.carpetas.put(actualizada);

		let carpetaPadreClientId = actual.carpetaPadreClientId;
		if (!carpetaPadreClientId && actual.carpetaPadreId !== undefined) {
			carpetaPadreClientId = (
				await db.carpetas.where("serverId").equals(actual.carpetaPadreId).first()
			)?.clientId;
		}

		await encolarCompactando(clientId, {
			clientOpId: nuevoId(),
			entityType: "carpeta",
			operation: "upsert",
			clientEntityId: clientId,
			baseVersion: actual.version,
			clientTimestamp: new Date().toISOString(),
			payload: payloadDeCarpeta(actualizada, carpetaPadreClientId),
			intentos: 0,
		});
	});

	await refrescarPendientes();
	void sincronizarPronto();
};

/** Borra una carpeta (y limpia localmente sus descendientes), offline-first. */
export const eliminarCarpetaLocal = async (clientId: string): Promise<void> => {
	await db.transaction("rw", db.carpetas, db.escritos, db.outbox, async () => {
		const carpeta = await db.carpetas.get(clientId);
		if (!carpeta) return;

		// Recolectar subcarpetas descendientes (por serverId) para limpieza local.
		const todas = await db.carpetas.toArray();
		const aBorrar = new Set<string>([clientId]);
		let cambio = true;
		while (cambio) {
			cambio = false;
			for (const c of todas) {
				const padre = todas.find((p) => p.serverId === c.carpetaPadreId);
				if (padre && aBorrar.has(padre.clientId) && !aBorrar.has(c.clientId)) {
					aBorrar.add(c.clientId);
					cambio = true;
				}
			}
		}

		const escritos = await db.escritos.toArray();
		for (const e of escritos) {
			const perteneceABorrada =
				(e.carpetaClientId !== undefined && aBorrar.has(e.carpetaClientId)) ||
				todas.some((c) => aBorrar.has(c.clientId) && c.serverId === e.carpetaId);
			if (perteneceABorrada) await db.escritos.delete(e.clientId);
		}

		await db.carpetas.bulkDelete([...aBorrar]);

		await encolarCompactando(clientId, {
			clientOpId: nuevoId(),
			entityType: "carpeta",
			operation: "delete",
			clientEntityId: clientId,
			baseVersion: carpeta.version,
			clientTimestamp: new Date().toISOString(),
			payload: {},
			intentos: 0,
		});
	});

	await refrescarPendientes();
	void sincronizarPronto();
};
