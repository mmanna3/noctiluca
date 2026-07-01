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
