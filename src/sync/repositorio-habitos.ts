import { db } from "./db";
import { refrescarPendientes } from "./estado-sync";
import { fechaClave } from "./fechas";
import { nuevoId } from "./ids";
import { compactar } from "./outbox";
import { sincronizarPronto } from "./sync-engine";
import { OperacionOutbox } from "./tipos";

const encolarCompactando = async (clientEntityId: string, op: OperacionOutbox): Promise<void> => {
	const pendientes = await db.outbox.where("clientEntityId").equals(clientEntityId).toArray();
	const compactadas = compactar(pendientes, op);
	await db.outbox.where("clientEntityId").equals(clientEntityId).delete();
	await db.outbox.bulkPut(compactadas);
};

/** Guarda (o actualiza) el registro de un hábito para un día, offline-first. */
export const guardarRegistroHabitoLocal = async (params: {
	habitoClientId: string;
	habitoId?: number;
	fecha: Date;
	valorBooleano?: boolean;
	valorNumerico?: number;
}): Promise<void> => {
	const clave = fechaClave(params.fecha);
	const clientTimestamp = new Date().toISOString();

	await db.transaction("rw", db.registrosHabito, db.outbox, async () => {
		const todos = await db.registrosHabito.toArray();
		const existente = todos.find(
			(r) => r.habitoClientId === params.habitoClientId && r.fecha === clave,
		);

		const clientId = existente?.clientId ?? nuevoId();

		await db.registrosHabito.put({
			clientId,
			serverId: existente?.serverId,
			habitoClientId: params.habitoClientId,
			habitoId: params.habitoId ?? existente?.habitoId,
			fecha: clave,
			valorBooleano: params.valorBooleano,
			valorNumerico: params.valorNumerico,
			version: existente?.version ?? 0,
			pendiente: true,
		});

		const op: OperacionOutbox = {
			clientOpId: nuevoId(),
			entityType: "registroHabito",
			operation: "upsert",
			clientEntityId: clientId,
			baseVersion: existente?.version,
			clientTimestamp,
			payload: {
				habitoClientId: params.habitoClientId,
				fecha: clave,
				valorBooleano: params.valorBooleano,
				valorNumerico: params.valorNumerico,
			},
			intentos: 0,
		};
		await encolarCompactando(clientId, op);
	});

	await refrescarPendientes();
	void sincronizarPronto();
};
