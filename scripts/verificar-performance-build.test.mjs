import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";
import { LIMITES } from "./limites-performance.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("performance PWA — inicio liviano", () => {
	it("no importa hábitos ni búsqueda de forma eager", () => {
		const contenido = readFileSync(path.join(RAIZ, "src/pantallas/inicio.tsx"), "utf8");
		const importsEager = contenido
			.split("\n")
			.filter((l) => l.trimStart().startsWith("import ") && !l.includes("React.lazy"));

		for (const linea of importsEager) {
			expect(linea).not.toMatch(/habit-tracker/);
			expect(linea).not.toMatch(/menu-habitos/);
			expect(linea).not.toMatch(/buscar-escritos/);
		}
	});
});

describe("performance PWA — límites documentados", () => {
	it("tiene umbrales razonables configurados", () => {
		expect(LIMITES.precacheMaxKiB).toBeLessThanOrEqual(900);
		expect(LIMITES.rutaCriticaGzipMaxBytes).toBeLessThanOrEqual(106 * 1024);
	});
});
