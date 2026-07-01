import { create } from "zustand";
import { db } from "./db";
import { EstadoGuardado } from "./tipos";

interface EstadoSyncState {
	estado: EstadoGuardado;
	pendientes: number;
	online: boolean;
	ultimoError?: string;
	setEstado: (estado: EstadoGuardado) => void;
	setPendientes: (pendientes: number) => void;
	setOnline: (online: boolean) => void;
	setError: (mensaje?: string) => void;
}

/**
 * Estado observable de la sincronización para mostrarlo en la UI (indicador de
 * "Guardando…/Guardado/Sin conexión" y contador de pendientes).
 */
export const useEstadoSync = create<EstadoSyncState>((set) => ({
	estado: "guardado",
	pendientes: 0,
	online: typeof navigator !== "undefined" ? navigator.onLine : true,
	setEstado: (estado) => set({ estado }),
	setPendientes: (pendientes) => set({ pendientes }),
	setOnline: (online) => set({ online }),
	setError: (ultimoError) => set({ ultimoError, estado: ultimoError ? "error" : "guardado" }),
}));

/** Deriva el estado de guardado a mostrar a partir de pendientes/conexión. */
export const recalcularEstado = (pendientes: number, online: boolean): EstadoGuardado => {
	if (pendientes === 0) return "guardado";
	if (!online) return "sin-conexion";
	return "guardando";
};

/** Relee el outbox y actualiza el contador/estado visible. */
export const refrescarPendientes = async (): Promise<void> => {
	const total = await db.outbox.filter((o) => !o.muerta).count();
	const online = typeof navigator !== "undefined" ? navigator.onLine : true;
	const store = useEstadoSync.getState();
	store.setPendientes(total);
	if (store.estado !== "error" || total === 0) store.setEstado(recalcularEstado(total, online));
};
