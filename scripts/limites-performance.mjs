/** Límites de performance PWA — ajustar solo con intención documentada. */
export const LIMITES = {
	precacheMaxKiB: 900,
	logo512MaxBytes: 50 * 1024,
	logo192MaxBytes: 20 * 1024,
	faviconSvgMaxBytes: 50 * 1024,
	appleTouchIconMaxBytes: 50 * 1024,
	/** Suma gzip del entry + modulepreload en index.html (ruta crítica de arranque). */
	rutaCriticaGzipMaxBytes: 106 * 1024,
	chunksProhibidosEnPrecache: ["resumen-semanal", "favicon.svg"],
};
