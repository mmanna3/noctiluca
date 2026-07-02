import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { bloquearSiOffline, estaOnline } from "./requiere-online";

const toastError = vi.fn();

vi.mock("sonner", () => ({
	toast: {
		error: (...args: unknown[]) => toastError(...args),
	},
}));

describe("estaOnline", () => {
	test("devuelve true cuando navigator.onLine es true", () => {
		vi.stubGlobal("navigator", { onLine: true });
		expect(estaOnline()).toBe(true);
	});

	test("devuelve false cuando navigator.onLine es false", () => {
		vi.stubGlobal("navigator", { onLine: false });
		expect(estaOnline()).toBe(false);
	});
});

describe("bloquearSiOffline", () => {
	beforeEach(() => {
		toastError.mockClear();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	test("no bloquea ni muestra toast si hay conexión", () => {
		vi.stubGlobal("navigator", { onLine: true });
		expect(bloquearSiOffline("Mensaje")).toBe(false);
		expect(toastError).not.toHaveBeenCalled();
	});

	test("bloquea y muestra toast si no hay conexión", () => {
		vi.stubGlobal("navigator", { onLine: false });
		expect(bloquearSiOffline("Sin red para mover")).toBe(true);
		expect(toastError).toHaveBeenCalledWith("Sin red para mover");
	});
});
