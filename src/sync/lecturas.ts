import { CarpetaDTO, EscritoDTO } from "@/api/clients";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import {
	aEscritoDTO,
	carpetaDesde,
	carpetasRaizDesde,
	papeleraDesde,
	todosLosEscritosDesde,
} from "./lecturas-core";

/**
 * Capa de lectura offline-first: reconstruye los DTOs que la UI ya consume
 * (`CarpetaDTO`/`EscritoDTO`) a partir de la base local (Dexie), de forma reactiva
 * con `useLiveQuery`. La fuente de verdad es Dexie; el motor de sync la mantiene
 * al día contra el backend. La lógica pura de reconstrucción vive en `lecturas-core`.
 */

/** Carpetas raíz (para el Inicio), ordenadas por posición, con sus conteos. */
export const usarCarpetasRaiz = (): CarpetaDTO[] | undefined =>
	useLiveQuery(async () => {
		const [carpetas, escritos] = await Promise.all([db.carpetas.toArray(), db.escritos.toArray()]);
		return carpetasRaizDesde(carpetas, escritos);
	}, []);

/** Detalle de una carpeta por su id de servidor, con escritos y subcarpetas. */
export const usarCarpeta = (serverId: number | string | undefined): CarpetaDTO | undefined | null =>
	useLiveQuery(async () => {
		if (!Number(serverId)) return null;
		const [carpetas, escritos] = await Promise.all([db.carpetas.toArray(), db.escritos.toArray()]);
		return carpetaDesde(serverId, carpetas, escritos);
	}, [serverId]);

/** Escritos en la papelera (para el Tacho). */
export const usarPapelera = (): EscritoDTO[] | undefined =>
	useLiveQuery(async () => {
		const [carpetas, escritos] = await Promise.all([db.carpetas.toArray(), db.escritos.toArray()]);
		return papeleraDesde(carpetas, escritos);
	}, []);

/** Todos los escritos vigentes (para el modo lectura). */
export const usarTodosLosEscritos = (): EscritoDTO[] | undefined =>
	useLiveQuery(async () => {
		const [carpetas, escritos] = await Promise.all([db.carpetas.toArray(), db.escritos.toArray()]);
		return todosLosEscritosDesde(carpetas, escritos);
	}, []);

/** Un escrito por su clientId (GUID) o su id de servidor. */
export const usarEscrito = (idOClientId: string | undefined): EscritoDTO | undefined | null =>
	useLiveQuery(async () => {
		if (!idOClientId) return null;
		const esNumerico = /^\d+$/.test(idOClientId);
		const escrito = esNumerico
			? await db.escritos.where("serverId").equals(Number(idOClientId)).first()
			: await db.escritos.get(idOClientId);
		if (!escrito) return null;
		let carpetaTitulo: string | undefined;
		if (escrito.carpetaClientId) {
			carpetaTitulo = (await db.carpetas.get(escrito.carpetaClientId))?.titulo;
		}
		return aEscritoDTO(escrito, carpetaTitulo);
	}, [idOClientId]);
