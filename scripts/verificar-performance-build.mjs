#!/usr/bin/env node
/**
 * Verifica límites de performance del build PWA.
 * Ejecutar después de `yarn build`. Falla con exit 1 si algún chequeo no se cumple.
 */
import { existsSync, readFileSync, statSync } from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { gzipSync } from "zlib";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

import { LIMITES } from "./limites-performance.mjs";

const errores = [];

const agregarError = (mensaje) => {
	errores.push(mensaje);
};

const tamanoArchivo = (ruta) => {
	if (!existsSync(ruta)) return null;
	return statSync(ruta).size;
};

const gzipSize = (ruta) => gzipSync(readFileSync(ruta)).length;

const verificarAssetsPublicos = () => {
	const svg = path.join(RAIZ, "public/favicon.svg");
	if (existsSync(svg)) {
		const bytes = tamanoArchivo(svg);
		if (bytes > LIMITES.faviconSvgMaxBytes) {
			agregarError(
				`public/favicon.svg pesa ${(bytes / 1024).toFixed(1)} KiB (máx ${LIMITES.faviconSvgMaxBytes / 1024} KiB). Usá favicon.ico/png o un SVG vectorial liviano.`,
			);
		}
	}

	const logo512Bytes = tamanoArchivo(path.join(RAIZ, "public/logo512.png"));
	if (logo512Bytes === null) {
		agregarError("Falta public/logo512.png");
	} else if (logo512Bytes > LIMITES.logo512MaxBytes) {
		agregarError(
			`public/logo512.png pesa ${(logo512Bytes / 1024).toFixed(1)} KiB (máx ${LIMITES.logo512MaxBytes / 1024} KiB).`,
		);
	}

	const logo192Bytes = tamanoArchivo(path.join(RAIZ, "public/logo192.png"));
	if (logo192Bytes !== null && logo192Bytes > LIMITES.logo192MaxBytes) {
		agregarError(
			`public/logo192.png pesa ${(logo192Bytes / 1024).toFixed(1)} KiB (máx ${LIMITES.logo192MaxBytes / 1024} KiB).`,
		);
	}

	const appleBytes = tamanoArchivo(path.join(RAIZ, "public/apple-touch-icon.png"));
	if (appleBytes !== null && appleBytes > LIMITES.appleTouchIconMaxBytes) {
		agregarError(
			`public/apple-touch-icon.png pesa ${(appleBytes / 1024).toFixed(1)} KiB (máx ${LIMITES.appleTouchIconMaxBytes / 1024} KiB).`,
		);
	}
};

const urlsPrecache = (swContenido) => {
	return [...new Set([...swContenido.matchAll(/url:"([^"]+)"/g)].map((m) => m[1]))];
};

const verificarPrecache = () => {
	const swPath = path.join(RAIZ, "dist/sw.js");
	if (!existsSync(swPath)) {
		agregarError("No existe dist/sw.js — ejecutá yarn build primero.");
		return;
	}

	const sw = readFileSync(swPath, "utf8");
	const urls = urlsPrecache(sw);

	let totalBytes = 0;
	for (const url of urls) {
		const assetPath = path.join(RAIZ, "dist", url);
		if (!existsSync(assetPath)) {
			agregarError(`Precache referencia archivo inexistente: ${url}`);
			continue;
		}
		totalBytes += statSync(assetPath).size;
	}

	const totalKiB = totalBytes / 1024;
	if (totalKiB > LIMITES.precacheMaxKiB) {
		agregarError(
			`Precache del SW: ${totalKiB.toFixed(1)} KiB (máx ${LIMITES.precacheMaxKiB} KiB). Revisá vite.config.ts globPatterns/globIgnores y assets en public/.`,
		);
	}

	for (const prohibido of LIMITES.chunksProhibidosEnPrecache) {
		if (urls.some((u) => u.includes(prohibido))) {
			agregarError(`El precache no debe incluir "${prohibido}". Agregalo a globIgnores en vite.config.ts.`);
		}
	}
};

const jsCriticoDesdeIndexHtml = () => {
	const htmlPath = path.join(RAIZ, "dist/index.html");
	if (!existsSync(htmlPath)) {
		agregarError("No existe dist/index.html — ejecutá yarn build primero.");
		return [];
	}

	const html = readFileSync(htmlPath, "utf8");
	const entry = html.match(/src="(\/assets\/index-[^"]+\.js)"/)?.[1];
	const preloads = [...html.matchAll(/href="(\/assets\/[^"]+\.js)"/g)].map((m) => m[1]);

	const rutas = new Set([entry, ...preloads].filter(Boolean));
	return [...rutas].map((ruta) => path.join(RAIZ, "dist", ruta.replace(/^\//, "")));
};

const verificarJsCritico = () => {
	const assetsDir = path.join(RAIZ, "dist/assets");
	if (!existsSync(assetsDir)) {
		agregarError("No existe dist/assets — ejecutá yarn build primero.");
		return;
	}

	const archivosCriticos = jsCriticoDesdeIndexHtml();
	if (archivosCriticos.length === 0) return;

	let gzipTotal = 0;
	for (const archivo of archivosCriticos) {
		if (!existsSync(archivo)) {
			agregarError(`JS crítico referenciado en index.html no existe: ${path.basename(archivo)}`);
			continue;
		}
		gzipTotal += gzipSize(archivo);
	}

	if (gzipTotal > LIMITES.rutaCriticaGzipMaxBytes) {
		agregarError(
			`JS de ruta crítica: ${(gzipTotal / 1024).toFixed(1)} KiB gzip (máx ${LIMITES.rutaCriticaGzipMaxBytes / 1024} KiB). Mantené Inicio liviano y usá React.lazy para pantallas secundarias.`,
		);
	}
};

const IMPORTS_PESADOS_EN_INICIO = [
	/habit-tracker["']/,
	/menu-habitos["']/,
	/buscar-escritos["']/,
];

const verificarInicioLiviano = () => {
	const inicioPath = path.join(RAIZ, "src/pantallas/inicio.tsx");
	if (!existsSync(inicioPath)) return;

	const contenido = readFileSync(inicioPath, "utf8");
	const lineasImport = contenido
		.split("\n")
		.filter((l) => l.trimStart().startsWith("import ") && !l.includes("React.lazy"));

	for (const linea of lineasImport) {
		for (const patron of IMPORTS_PESADOS_EN_INICIO) {
			if (patron.test(linea)) {
				agregarError(
					`inicio.tsx importa en forma eager un módulo pesado: ${linea.trim()}. Usá React.lazy().`,
				);
			}
		}
	}
};

const main = () => {
	verificarAssetsPublicos();
	verificarPrecache();
	verificarJsCritico();
	verificarInicioLiviano();

	if (errores.length === 0) {
		console.log("✓ Chequeos de performance PWA OK");
		process.exit(0);
	}

	console.error("✗ Chequeos de performance PWA fallaron:\n");
	for (const error of errores) {
		console.error(`  • ${error}`);
	}
	process.exit(1);
};

const esEjecucionDirecta =
	process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (esEjecucionDirecta) {
	main();
}
