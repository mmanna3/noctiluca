import { db } from "./db";
import { refrescarPendientes } from "./estado-sync";
import { nuevoId } from "./ids";
import { compactar } from "./outbox";
import { sincronizarPronto } from "./sync-engine";
import { ItemObjetivoLocal, OperacionOutbox } from "./tipos";

const encolarCompactando = async (clientEntityId: string, op: OperacionOutbox): Promise<void> => {
	const pendientes = await db.outbox.where("clientEntityId").equals(clientEntityId).toArray();
	const compactadas = compactar(pendientes, op);
	await db.outbox.where("clientEntityId").equals(clientEntityId).delete();
	await db.outbox.bulkPut(compactadas);
};

const payloadDeItem = (item: ItemObjetivoLocal) => ({
	texto: item.texto,
	completado: item.completado,
	posicion: item.posicion,
	fechaCompletado: item.fechaCompletado,
	listaTipo: item.listaTipo,
	listaClavePeriodo: item.listaClavePeriodo,
});

const encolarUpsertItem = async (item: ItemObjetivoLocal): Promise<void> => {
	const clientTimestamp = new Date().toISOString();
	const op: OperacionOutbox = {
		clientOpId: nuevoId(),
		entityType: "itemObjetivo",
		operation: "upsert",
		clientEntityId: item.clientId,
		baseVersion: item.version,
		clientTimestamp,
		payload: payloadDeItem(item),
		intentos: 0,
	};
	await encolarCompactando(item.clientId, op);
};

/** Alta offline de un ítem de objetivo. Devuelve el clientId. */
export const crearItemObjetivoLocal = async (params: {
	listaTipo: number;
	listaClavePeriodo: string;
	texto: string;
	posicion?: number;
}): Promise<string> => {
	const clientId = nuevoId();
	const items = await db.itemsObjetivo
		.filter(
			(i) => i.listaTipo === params.listaTipo && i.listaClavePeriodo === params.listaClavePeriodo,
		)
		.toArray();
	const posicion =
		params.posicion ??
		items.reduce((max, i) => Math.max(max, i.posicion ?? 0), -1) + 1;

	const item: ItemObjetivoLocal = {
		clientId,
		texto: params.texto,
		completado: false,
		posicion,
		listaTipo: params.listaTipo,
		listaClavePeriodo: params.listaClavePeriodo,
		version: 0,
		pendiente: true,
	};

	await db.transaction("rw", db.itemsObjetivo, db.outbox, async () => {
		await db.itemsObjetivo.put(item);
		await encolarUpsertItem(item);
	});

	await refrescarPendientes();
	void sincronizarPronto();
	return clientId;
};

export const editarItemObjetivoLocal = async (
	clientId: string,
	texto: string,
): Promise<void> => {
	await db.transaction("rw", db.itemsObjetivo, db.outbox, async () => {
		const actual = await db.itemsObjetivo.get(clientId);
		if (!actual) return;
		const actualizado = { ...actual, texto, pendiente: true };
		await db.itemsObjetivo.put(actualizado);
		await encolarUpsertItem(actualizado);
	});
	await refrescarPendientes();
	void sincronizarPronto();
};

export const toggleItemObjetivoLocal = async (clientId: string): Promise<void> => {
	await db.transaction("rw", db.itemsObjetivo, db.outbox, async () => {
		const actual = await db.itemsObjetivo.get(clientId);
		if (!actual) return;
		const completado = !actual.completado;
		const actualizado: ItemObjetivoLocal = {
			...actual,
			completado,
			fechaCompletado: completado ? new Date().toISOString() : undefined,
			pendiente: true,
		};
		await db.itemsObjetivo.put(actualizado);
		await encolarUpsertItem(actualizado);
	});
	await refrescarPendientes();
	void sincronizarPronto();
};

export const eliminarItemObjetivoLocal = async (clientId: string): Promise<void> => {
	const clientTimestamp = new Date().toISOString();
	await db.transaction("rw", db.itemsObjetivo, db.outbox, async () => {
		const actual = await db.itemsObjetivo.get(clientId);
		await db.itemsObjetivo.delete(clientId);
		await encolarCompactando(clientId, {
			clientOpId: nuevoId(),
			entityType: "itemObjetivo",
			operation: "delete",
			clientEntityId: clientId,
			baseVersion: actual?.version,
			clientTimestamp,
			payload: {},
			intentos: 0,
		});
	});
	await refrescarPendientes();
	void sincronizarPronto();
};

/** Reordena ítems encolando un upsert por cada uno (reemplaza api.posiciones). */
export const reordenarItemsObjetivoLocal = async (
	items: { clientId: string; posicion: number }[],
): Promise<void> => {
	await db.transaction("rw", db.itemsObjetivo, db.outbox, async () => {
		for (const { clientId, posicion } of items) {
			const actual = await db.itemsObjetivo.get(clientId);
			if (!actual) continue;
			const actualizado = { ...actual, posicion, pendiente: true };
			await db.itemsObjetivo.put(actualizado);
			await encolarUpsertItem(actualizado);
		}
	});
	await refrescarPendientes();
	void sincronizarPronto();
};
