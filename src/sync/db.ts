import Dexie, { Table } from "dexie";
import { nuevoId } from "./ids";
import { CarpetaLocal, EscritoLocal, OperacionOutbox } from "./tipos";

interface Meta {
	clave: string;
	valor: string;
}

/**
 * Base local (IndexedDB) de la app. Es la fuente de verdad offline: la UI lee de
 * acá y el motor de sync la mantiene actualizada contra el backend.
 */
class NoctilucaDB extends Dexie {
	escritos!: Table<EscritoLocal, string>;
	carpetas!: Table<CarpetaLocal, string>;
	outbox!: Table<OperacionOutbox, string>;
	meta!: Table<Meta, string>;

	constructor() {
		super("noctiluca");
		this.version(1).stores({
			escritos: "clientId, serverId, carpetaClientId, version",
			carpetas: "clientId, serverId, version",
			outbox: "clientOpId, clientEntityId, entityType",
			meta: "clave",
		});
	}
}

export const db = new NoctilucaDB();

const CLAVE_CURSOR = "cursor";
const CLAVE_DEVICE_ID = "deviceId";

export const leerCursor = async (): Promise<number> => {
	const fila = await db.meta.get(CLAVE_CURSOR);
	return fila ? Number(fila.valor) : 0;
};

export const guardarCursor = async (cursor: number): Promise<void> => {
	await db.meta.put({ clave: CLAVE_CURSOR, valor: String(cursor) });
};

/** Id estable de este dispositivo/instalación (se genera una sola vez). */
export const obtenerDeviceId = async (): Promise<string> => {
	const fila = await db.meta.get(CLAVE_DEVICE_ID);
	if (fila) return fila.valor;
	const id = nuevoId();
	await db.meta.put({ clave: CLAVE_DEVICE_ID, valor: id });
	return id;
};
