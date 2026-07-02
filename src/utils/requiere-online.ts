import { toast } from "sonner";

export const MENSAJE_SOLO_ONLINE = "Esta acción requiere conexión a internet.";

export const estaOnline = (): boolean =>
	typeof navigator === "undefined" || navigator.onLine;

/**
 * Si no hay conexión, muestra un toast y devuelve true (acción bloqueada).
 * Mensaje opcional para contextualizar (mover, reordenar, etc.).
 */
export const bloquearSiOffline = (mensaje = MENSAJE_SOLO_ONLINE): boolean => {
	if (estaOnline()) return false;
	toast.error(mensaje);
	return true;
};
