import { CarpetaDTO, EscritoDTO } from "@/api/clients";
import { CarpetaLocal, EscritoLocal } from "./tipos";

/**
 * Lógica pura de reconstrucción de los DTOs (`CarpetaDTO`/`EscritoDTO`) que la UI
 * consume, a partir de los registros locales. Sin dependencias de Dexie, para que
 * sea testeable de forma aislada; los hooks reactivos viven en `lecturas.ts`.
 */

const escritosDeCarpeta = (escritos: EscritoLocal[], carpeta: CarpetaLocal): EscritoLocal[] =>
	escritos.filter(
		(e) =>
			!e.estaEnPapelera &&
			(e.carpetaClientId === carpeta.clientId ||
				(e.carpetaId !== undefined && e.carpetaId === carpeta.serverId)),
	);

const subcarpetasDe = (carpetas: CarpetaLocal[], carpeta: CarpetaLocal): CarpetaLocal[] =>
	carpetas.filter((c) => carpeta.serverId !== undefined && c.carpetaPadreId === carpeta.serverId);

const tiempo = (valor?: string): number => (valor ? new Date(valor).getTime() : 0);

export const ordenarEscritos = (escritos: EscritoLocal[], criterio?: number): EscritoLocal[] => {
	const copia = [...escritos];
	switch (criterio) {
	case 2:
		return copia.sort((a, b) => tiempo(b.fechaHoraEdicion) - tiempo(a.fechaHoraEdicion));
	case 3:
		return copia.sort((a, b) => a.titulo.localeCompare(b.titulo));
	case 4:
		return copia.sort((a, b) => tiempo(a.fechaHoraCreacion) - tiempo(b.fechaHoraCreacion));
	case 5:
		return copia.sort((a, b) => tiempo(a.fechaHoraEdicion) - tiempo(b.fechaHoraEdicion));
	case 6:
		return copia.sort((a, b) => b.titulo.localeCompare(a.titulo));
	case 1:
	default:
		return copia.sort((a, b) => tiempo(b.fechaHoraCreacion) - tiempo(a.fechaHoraCreacion));
	}
};

export const aEscritoDTO = (e: EscritoLocal, carpetaTitulo?: string): EscritoDTO =>
	new EscritoDTO({
		id: e.serverId,
		clientId: e.clientId,
		titulo: e.titulo,
		cuerpo: e.cuerpo,
		carpetaId: e.carpetaId ?? 0,
		carpetaClientId: e.carpetaClientId,
		carpetaTitulo,
		estaEnPapelera: e.estaEnPapelera,
		fechaHoraCreacion: e.fechaHoraCreacion ? new Date(e.fechaHoraCreacion) : undefined,
		fechaHoraEdicion: e.fechaHoraEdicion ? new Date(e.fechaHoraEdicion) : undefined,
		version: e.version,
	});

export const aCarpetaDTO = (
	c: CarpetaLocal,
	todasLasCarpetas: CarpetaLocal[],
	todosLosEscritos: EscritoLocal[],
	incluirHijos: boolean,
): CarpetaDTO => {
	const escritos = escritosDeCarpeta(todosLosEscritos, c);
	const subcarpetas = subcarpetasDe(todasLasCarpetas, c);

	return new CarpetaDTO({
		id: c.serverId,
		clientId: c.clientId,
		titulo: c.titulo,
		posicion: c.posicion ?? 0,
		criterioDeOrden: c.criterioDeOrden ?? 1,
		carpetaPadreId: c.carpetaPadreId,
		esSistema: c.esSistema ?? false,
		requiereAutenticacion: c.requiereAutenticacion ?? false,
		propositoCarpeta: c.propositoCarpeta ?? undefined,
		version: c.version,
		cantidadDeEscritos: escritos.length,
		cantidadDeSubCarpetas: subcarpetas.length,
		escritos: incluirHijos
			? ordenarEscritos(escritos, c.criterioDeOrden).map((e) => aEscritoDTO(e))
			: undefined,
		subCarpetas: incluirHijos
			? subcarpetas.map((sc) => aCarpetaDTO(sc, todasLasCarpetas, todosLosEscritos, false))
			: undefined,
	});
};

export const carpetasRaizDesde = (
	carpetas: CarpetaLocal[],
	escritos: EscritoLocal[],
): CarpetaDTO[] =>
	carpetas
		.filter((c) => c.carpetaPadreId === undefined || c.carpetaPadreId === null)
		.sort((a, b) => (a.posicion ?? 0) - (b.posicion ?? 0))
		.map((c) => aCarpetaDTO(c, carpetas, escritos, false));

export const carpetaDesde = (
	serverId: number | string | undefined,
	carpetas: CarpetaLocal[],
	escritos: EscritoLocal[],
): CarpetaDTO | null => {
	const id = Number(serverId);
	if (!id) return null;
	const carpeta = carpetas.find((c) => c.serverId === id);
	if (!carpeta) return null;
	return aCarpetaDTO(carpeta, carpetas, escritos, true);
};

const tituloDeCarpetaDe = (e: EscritoLocal, carpetas: CarpetaLocal[]): string | undefined =>
	carpetas.find(
		(c) =>
			(e.carpetaClientId !== undefined && c.clientId === e.carpetaClientId) ||
			(e.carpetaId !== undefined && c.serverId === e.carpetaId),
	)?.titulo;

const porCreacionDesc = (a: EscritoLocal, b: EscritoLocal): number =>
	(b.fechaHoraCreacion ? new Date(b.fechaHoraCreacion).getTime() : 0) -
	(a.fechaHoraCreacion ? new Date(a.fechaHoraCreacion).getTime() : 0);

/** Escritos en papelera, más recientes primero, con el título de su carpeta. */
export const papeleraDesde = (carpetas: CarpetaLocal[], escritos: EscritoLocal[]): EscritoDTO[] =>
	escritos
		.filter((e) => e.estaEnPapelera)
		.sort(porCreacionDesc)
		.map((e) => aEscritoDTO(e, tituloDeCarpetaDe(e, carpetas)));

/** Todos los escritos vigentes (no papelera), con el título de su carpeta. */
export const todosLosEscritosDesde = (
	carpetas: CarpetaLocal[],
	escritos: EscritoLocal[],
): EscritoDTO[] =>
	escritos
		.filter((e) => !e.estaEnPapelera)
		.sort(porCreacionDesc)
		.map((e) => aEscritoDTO(e, tituloDeCarpetaDe(e, carpetas)));
