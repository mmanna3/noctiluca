import { EscritoDTO } from "@/api/clients";
import { aEscritoDTO } from "./lecturas-core";
import { CarpetaLocal, EscritoLocal } from "./tipos";

export const MINIMO_CARACTERES_BUSQUEDA = 3;

/** Normaliza texto para comparación insensible a mayúsculas y acentos. */
export const normalizarTextoBusqueda = (texto: string): string =>
	texto
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.trim();

const tituloDeCarpetaDe = (e: EscritoLocal, carpetas: CarpetaLocal[]): string | undefined =>
	carpetas.find(
		(c) =>
			(e.carpetaClientId !== undefined && c.clientId === e.carpetaClientId) ||
			(e.carpetaId !== undefined && c.serverId === e.carpetaId),
	)?.titulo;

const porEdicionDesc = (a: EscritoLocal, b: EscritoLocal): number => {
	const tiempo = (valor?: string): number => (valor ? new Date(valor).getTime() : 0);
	return (
		tiempo(b.fechaHoraEdicion ?? b.fechaHoraCreacion) -
		tiempo(a.fechaHoraEdicion ?? a.fechaHoraCreacion)
	);
};

const coincideConTerminos = (texto: string, terminos: string[]): boolean => {
	const normalizado = normalizarTextoBusqueda(texto);
	return terminos.every((t) => normalizado.includes(t));
};

/**
 * Busca escritos vigentes (no papelera) en la base local.
 * Todos los términos deben aparecer en título o cuerpo; prioriza coincidencias en el título.
 */
export const buscarEscritosDesde = (
	carpetas: CarpetaLocal[],
	escritos: EscritoLocal[],
	consulta: string,
): EscritoDTO[] => {
	const terminos = normalizarTextoBusqueda(consulta)
		.split(/\s+/)
		.filter(Boolean);
	if (terminos.length === 0) return [];

	const candidatos = escritos.filter((e) => !e.estaEnPapelera);

	return candidatos
		.filter((e) => coincideConTerminos(`${e.titulo} ${e.cuerpo ?? ""}`, terminos))
		.sort((a, b) => {
			const aEnTitulo = coincideConTerminos(a.titulo, terminos);
			const bEnTitulo = coincideConTerminos(b.titulo, terminos);
			if (aEnTitulo !== bEnTitulo) return aEnTitulo ? -1 : 1;
			return porEdicionDesc(a, b);
		})
		.map((e) => aEscritoDTO(e, tituloDeCarpetaDe(e, carpetas)));
};
