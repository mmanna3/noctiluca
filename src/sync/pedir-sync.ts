/**
 * Dispara una sincronización cargando el motor de forma diferida (chunk lazy).
 * Se usa tras mutaciones que van directo a la API (borrar carpeta, criterio de
 * orden, reordenar) para reflejar el cambio en la base local cuanto antes, sin
 * arrastrar el motor completo al bundle de arranque.
 */
export const pedirSync = (): void => {
	void import("./sync-engine").then((m) => m.sincronizarPronto());
};
