import { describe, expect, test } from "vitest";
import { buscarEscritosDesde, normalizarTextoBusqueda } from "./busqueda-core";
import { CarpetaLocal, EscritoLocal } from "./tipos";

const carpeta = (over: Partial<CarpetaLocal>): CarpetaLocal => ({
	clientId: over.clientId ?? "c-" + Math.random(),
	serverId: over.serverId,
	titulo: over.titulo ?? "Carpeta",
	version: over.version ?? 1,
});

const escrito = (over: Partial<EscritoLocal>): EscritoLocal => ({
	clientId: over.clientId ?? "e-" + Math.random(),
	serverId: over.serverId,
	titulo: over.titulo ?? "Escrito",
	cuerpo: over.cuerpo ?? "",
	carpetaClientId: over.carpetaClientId,
	carpetaId: over.carpetaId,
	version: over.version ?? 1,
	estaEnPapelera: over.estaEnPapelera,
	fechaHoraEdicion: over.fechaHoraEdicion,
	fechaHoraCreacion: over.fechaHoraCreacion,
});

describe("normalizarTextoBusqueda", () => {
	test("ignora mayúsculas y acentos", () => {
		expect(normalizarTextoBusqueda("Café")).toBe("cafe");
	});
});

describe("buscarEscritosDesde", () => {
	const carpetas = [
		carpeta({ clientId: "c1", serverId: 1, titulo: "Trabajo" }),
		carpeta({ clientId: "c2", serverId: 2, titulo: "Personal" }),
	];

	test("excluye escritos en papelera", () => {
		const escritos = [
			escrito({ titulo: "Nota vigente", cuerpo: "alpha", carpetaClientId: "c1" }),
			escrito({
				titulo: "Nota borrada",
				cuerpo: "alpha",
				carpetaClientId: "c1",
				estaEnPapelera: true,
			}),
		];
		const resultados = buscarEscritosDesde(carpetas, escritos, "alpha");
		expect(resultados).toHaveLength(1);
		expect(resultados[0].titulo).toBe("Nota vigente");
	});

	test("requiere que todos los términos aparezcan en título o cuerpo", () => {
		const escritos = [
			escrito({ titulo: "Reunión", cuerpo: "con el equipo de ventas", carpetaClientId: "c1" }),
			escrito({ titulo: "Compras", cuerpo: "lista del super", carpetaClientId: "c2" }),
		];
		const resultados = buscarEscritosDesde(carpetas, escritos, "reunion equipo");
		expect(resultados).toHaveLength(1);
		expect(resultados[0].titulo).toBe("Reunión");
	});

	test("prioriza coincidencias en el título", () => {
		const escritos = [
			escrito({
				titulo: "Ideas",
				cuerpo: "proyecto alpha",
				carpetaClientId: "c1",
				fechaHoraEdicion: "2026-01-01T00:00:00.000Z",
			}),
			escrito({
				titulo: "Proyecto alpha",
				cuerpo: "notas",
				carpetaClientId: "c2",
				fechaHoraEdicion: "2026-06-01T00:00:00.000Z",
			}),
		];
		const resultados = buscarEscritosDesde(carpetas, escritos, "proyecto alpha");
		expect(resultados[0].titulo).toBe("Proyecto alpha");
	});

	test("incluye el título de la carpeta en el DTO", () => {
		const escritos = [escrito({ titulo: "Informe", cuerpo: "datos", carpetaClientId: "c1" })];
		const resultados = buscarEscritosDesde(carpetas, escritos, "informe");
		expect(resultados[0].carpetaTitulo).toBe("Trabajo");
	});
});
