import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { usarAutoguardado } from "./usar-autoguardado";

const mockGuardar = vi.fn().mockResolvedValue(undefined);

vi.mock("@/sync/repositorio-escritos", () => ({
	guardarEscritoLocal: (...args: unknown[]) => mockGuardar(...args),
}));

const escrito = { clientId: "guid-1", carpetaClientId: "carp-1", carpetaId: 1, titulo: "Hola", cuerpo: "Mundo" };

const Editor = ({ titulo, cuerpo }: { titulo: string; cuerpo: string }) => {
	usarAutoguardado(escrito, titulo, cuerpo);
	return null;
};

beforeEach(() => {
	vi.useFakeTimers();
	mockGuardar.mockClear();
});

afterEach(() => {
	vi.useRealTimers();
});

describe("usarAutoguardado", () => {
	test("no guarda en la carga inicial (seed)", () => {
		render(<Editor titulo='Hola' cuerpo='Mundo' />);
		act(() => vi.advanceTimersByTime(1000));
		expect(mockGuardar).not.toHaveBeenCalled();
	});

	test("guarda (debounced) cuando cambia el contenido", () => {
		const { rerender } = render(<Editor titulo='Hola' cuerpo='Mundo' />);

		rerender(<Editor titulo='Hola editado' cuerpo='Mundo' />);
		// Antes del debounce no guardó todavía.
		act(() => vi.advanceTimersByTime(400));
		expect(mockGuardar).not.toHaveBeenCalled();

		act(() => vi.advanceTimersByTime(400));
		expect(mockGuardar).toHaveBeenCalledTimes(1);
		expect(mockGuardar).toHaveBeenCalledWith(
			expect.objectContaining({ clientId: "guid-1", titulo: "Hola editado", cuerpo: "Mundo" }),
		);
	});

	test("colapsa múltiples cambios rápidos en un solo guardado", () => {
		const { rerender } = render(<Editor titulo='Hola' cuerpo='Mundo' />);

		rerender(<Editor titulo='H1' cuerpo='Mundo' />);
		act(() => vi.advanceTimersByTime(200));
		rerender(<Editor titulo='H2' cuerpo='Mundo' />);
		act(() => vi.advanceTimersByTime(200));
		rerender(<Editor titulo='H3' cuerpo='Mundo' />);
		act(() => vi.advanceTimersByTime(800));

		expect(mockGuardar).toHaveBeenCalledTimes(1);
		expect(mockGuardar).toHaveBeenCalledWith(expect.objectContaining({ titulo: "H3" }));
	});

	test("hace flush al desmontar (caso botón atrás)", () => {
		const { rerender, unmount } = render(<Editor titulo='Hola' cuerpo='Mundo' />);
		rerender(<Editor titulo='Cambio sin esperar debounce' cuerpo='Mundo' />);

		// Se desmonta antes de que venza el debounce: igual debe guardar.
		unmount();

		expect(mockGuardar).toHaveBeenCalledTimes(1);
		expect(mockGuardar).toHaveBeenCalledWith(
			expect.objectContaining({ titulo: "Cambio sin esperar debounce" }),
		);
	});
});
