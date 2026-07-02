import { EscritoDTO } from "@/api/clients";
import { useLiveQuery } from "dexie-react-hooks";
import { buscarEscritosDesde, MINIMO_CARACTERES_BUSQUEDA } from "./busqueda-core";
import { db } from "./db";

/** Búsqueda reactiva de escritos en Dexie (offline-first). */
export const usarBusquedaEscritos = (
	consulta: string,
): EscritoDTO[] | undefined =>
	useLiveQuery(async () => {
		const texto = consulta.trim();
		if (texto.length < MINIMO_CARACTERES_BUSQUEDA) return [];
		const [carpetas, escritos] = await Promise.all([
			db.carpetas.toArray(),
			db.escritos.toArray(),
		]);
		return buscarEscritosDesde(carpetas, escritos, texto);
	}, [consulta]);
