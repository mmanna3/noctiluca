import { useCallback, useEffect, useRef } from "react";
import { guardarEscritoLocal } from "@/sync/repositorio-escritos";

const DEBOUNCE_MS = 700;

interface EscritoEditable {
	clientId?: string;
	carpetaClientId?: string;
	carpetaId?: number;
	titulo?: string;
	cuerpo?: string;
}

/**
 * Autoguardado del editor de escritos. Persiste (debounced) en la base local +
 * outbox cada vez que cambian título o cuerpo, y fuerza un guardado al ocultarse
 * la página (`pagehide`/`visibilitychange`) y al desmontarse el componente (que
 * es lo que ocurre al tocar "atrás"). Así el guardado ya no depende del botón.
 */
export const usarAutoguardado = (escrito: EscritoEditable | undefined, titulo: string, cuerpo: string) => {
	const timer = useRef<ReturnType<typeof setTimeout>>();
	const primeraCarga = useRef(true);
	const ultimoGuardado = useRef({ titulo: escrito?.titulo ?? "", cuerpo: escrito?.cuerpo ?? "" });

	const guardar = useCallback(async () => {
		if (!escrito?.clientId) return;
		if (titulo === ultimoGuardado.current.titulo && cuerpo === ultimoGuardado.current.cuerpo) return;
		ultimoGuardado.current = { titulo, cuerpo };
		await guardarEscritoLocal({
			clientId: escrito.clientId,
			titulo,
			cuerpo,
			carpetaClientId: escrito.carpetaClientId,
			carpetaId: escrito.carpetaId,
		});
	}, [escrito?.clientId, escrito?.carpetaClientId, escrito?.carpetaId, titulo, cuerpo]);

	// Mantiene la última versión de `guardar` para los listeners registrados una sola vez.
	const guardarRef = useRef(guardar);
	useEffect(() => {
		guardarRef.current = guardar;
	}, [guardar]);

	// Al cargar un escrito nuevo, resetear la referencia para no autoguardar el seed.
	useEffect(() => {
		primeraCarga.current = true;
		ultimoGuardado.current = { titulo: escrito?.titulo ?? "", cuerpo: escrito?.cuerpo ?? "" };
	}, [escrito?.clientId]);

	// Debounce sobre los cambios de título/cuerpo.
	useEffect(() => {
		if (!escrito?.clientId) return;
		if (primeraCarga.current) {
			primeraCarga.current = false;
			return;
		}
		clearTimeout(timer.current);
		timer.current = setTimeout(() => void guardarRef.current(), DEBOUNCE_MS);
		return () => clearTimeout(timer.current);
	}, [titulo, cuerpo, escrito?.clientId]);

	// Flush ante pagehide / ocultamiento / desmontaje (ej. botón atrás).
	useEffect(() => {
		const flush = () => {
			clearTimeout(timer.current);
			void guardarRef.current();
		};
		const alOcultar = () => {
			if (document.visibilityState === "hidden") flush();
		};
		window.addEventListener("pagehide", flush);
		document.addEventListener("visibilitychange", alOcultar);
		return () => {
			window.removeEventListener("pagehide", flush);
			document.removeEventListener("visibilitychange", alOcultar);
			flush();
		};
	}, []);

	const flush = useCallback(() => {
		clearTimeout(timer.current);
		return guardarRef.current();
	}, []);

	return { flush };
};
