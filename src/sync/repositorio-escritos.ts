import { db } from "./db";
import { refrescarPendientes } from "./estado-sync";
import { nuevoId } from "./ids";
import { compactar } from "./outbox";
import { sincronizarPronto } from "./sync-engine";
import { EscritoLocal, OperacionOutbox } from "./tipos";

/**
 * Guarda en la base local (sin pisar) el escrito recién traído del servidor, para
 * que quede disponible offline y con su versión conocida (baseVersion de futuras
 * ediciones). No sobrescribe si hay cambios locales pendientes.
 */
export const sembrarEscrito = async (escrito: EscritoLocal): Promise<void> => {
	const existente = await db.escritos.get(escrito.clientId);
	if (existente?.pendiente) return;
	await db.escritos.put({ ...escrito, pendiente: false });
};

/**
 * Alta offline de un escrito: genera su GUID, lo persiste localmente (queda visible
 * de inmediato en la carpeta) y encola su upsert. Devuelve el clientId para navegar.
 */
export const crearEscritoLocal = async (params: {
	titulo: string;
	cuerpo: string;
	carpetaClientId?: string;
	carpetaId?: number;
}): Promise<string> => {
	const clientId = nuevoId();
	const ahora = new Date().toISOString();

	// Resolver el clientId de la carpeta (necesario para asociar en el push) si no vino.
	let carpetaClientId = params.carpetaClientId;
	if (!carpetaClientId && params.carpetaId !== undefined) {
		carpetaClientId = (await db.carpetas.where("serverId").equals(params.carpetaId).first())
			?.clientId;
	}

	await db.transaction("rw", db.escritos, db.outbox, async () => {
		await db.escritos.put({
			clientId,
			titulo: params.titulo,
			cuerpo: params.cuerpo,
			carpetaClientId,
			carpetaId: params.carpetaId,
			version: 0,
			fechaHoraCreacion: ahora,
			fechaHoraEdicion: ahora,
			estaEnPapelera: false,
			pendiente: true,
		});

		const op: OperacionOutbox = {
			clientOpId: nuevoId(),
			entityType: "escrito",
			operation: "upsert",
			clientEntityId: clientId,
			clientTimestamp: ahora,
			payload: {
				titulo: params.titulo,
				cuerpo: params.cuerpo,
				carpetaClientId,
				estaEnPapelera: false,
				fechaHoraCreacion: ahora,
			},
			intentos: 0,
		};
		await db.outbox.put(op);
	});

	await refrescarPendientes();
	void sincronizarPronto();
	return clientId;
};

/**
 * Autoguardado: persiste el escrito en local y encola (compactando) una operación
 * de upsert en el outbox, luego dispara la sincronización. Es la única vía de
 * guardado del editor: el botón "atrás" ya no persiste, solo navega.
 */
export const guardarEscritoLocal = async (params: {
	clientId: string;
	titulo: string;
	cuerpo: string;
	carpetaClientId?: string;
	carpetaId?: number;
}): Promise<void> => {
	const clientTimestamp = new Date().toISOString();

	await db.transaction("rw", db.escritos, db.outbox, async () => {
		const actual = await db.escritos.get(params.clientId);
		const carpetaClientId = params.carpetaClientId ?? actual?.carpetaClientId;

		await db.escritos.put({
			clientId: params.clientId,
			serverId: actual?.serverId,
			titulo: params.titulo,
			cuerpo: params.cuerpo,
			carpetaClientId,
			carpetaId: params.carpetaId ?? actual?.carpetaId,
			version: actual?.version ?? 0,
			fechaHoraCreacion: actual?.fechaHoraCreacion,
			fechaHoraEdicion: clientTimestamp,
			estaEnPapelera: actual?.estaEnPapelera ?? false,
			pendiente: true,
		});

		const op: OperacionOutbox = {
			clientOpId: nuevoId(),
			entityType: "escrito",
			operation: "upsert",
			clientEntityId: params.clientId,
			baseVersion: actual?.version,
			clientTimestamp,
			payload: {
				titulo: params.titulo,
				cuerpo: params.cuerpo,
				carpetaClientId,
				estaEnPapelera: actual?.estaEnPapelera ?? false,
			},
			intentos: 0,
		};

		const pendientesEntidad = await db.outbox
			.where("clientEntityId")
			.equals(params.clientId)
			.toArray();
		const compactadas = compactar(pendientesEntidad, op);
		await db.outbox.where("clientEntityId").equals(params.clientId).delete();
		await db.outbox.bulkPut(compactadas);
	});

	await refrescarPendientes();
	void sincronizarPronto();
};

const encolarCompactando = async (clientEntityId: string, op: OperacionOutbox): Promise<void> => {
	const pendientes = await db.outbox.where("clientEntityId").equals(clientEntityId).toArray();
	const compactadas = compactar(pendientes, op);
	await db.outbox.where("clientEntityId").equals(clientEntityId).delete();
	await db.outbox.bulkPut(compactadas);
};

/** Manda un escrito a la papelera (o lo restaura), offline-first. */
export const cambiarPapeleraLocal = async (
	clientId: string,
	estaEnPapelera: boolean,
): Promise<void> => {
	const clientTimestamp = new Date().toISOString();

	await db.transaction("rw", db.escritos, db.outbox, async () => {
		const actual = await db.escritos.get(clientId);
		if (!actual) return;

		await db.escritos.put({
			...actual,
			estaEnPapelera,
			fechaHoraEdicion: clientTimestamp,
			pendiente: true,
		});

		const op: OperacionOutbox = {
			clientOpId: nuevoId(),
			entityType: "escrito",
			operation: "upsert",
			clientEntityId: clientId,
			baseVersion: actual.version,
			clientTimestamp,
			payload: {
				titulo: actual.titulo,
				cuerpo: actual.cuerpo,
				carpetaClientId: actual.carpetaClientId,
				estaEnPapelera,
			},
			intentos: 0,
		};
		await encolarCompactando(clientId, op);
	});

	await refrescarPendientes();
	void sincronizarPronto();
};

/** Borra definitivamente un escrito (desde la papelera), offline-first. */
export const eliminarEscritoLocal = async (clientId: string): Promise<void> => {
	const clientTimestamp = new Date().toISOString();

	await db.transaction("rw", db.escritos, db.outbox, async () => {
		const actual = await db.escritos.get(clientId);
		await db.escritos.delete(clientId);

		const op: OperacionOutbox = {
			clientOpId: nuevoId(),
			entityType: "escrito",
			operation: "delete",
			clientEntityId: clientId,
			baseVersion: actual?.version,
			clientTimestamp,
			payload: {},
			intentos: 0,
		};
		await encolarCompactando(clientId, op);
	});

	await refrescarPendientes();
	void sincronizarPronto();
};
