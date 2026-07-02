import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { EstadoGuardado } from "@/sync/tipos";
import IndicadorSync from "./indicador-sync";

const mockPedirSync = vi.fn();
const mockToastError = vi.fn();

let mockEstado: {
	online: boolean;
	pendientes: number;
	estado: EstadoGuardado;
	sincronizando: boolean;
} = {
	online: true,
	pendientes: 0,
	estado: "guardado",
	sincronizando: false,
};

vi.mock("@/sync/estado-sync", () => ({
	useEstadoSync: (selector: (s: typeof mockEstado) => unknown) => selector(mockEstado),
}));

vi.mock("@/sync/pedir-sync", () => ({
	pedirSync: () => mockPedirSync(),
}));

vi.mock("sonner", () => ({
	toast: {
		error: (...args: unknown[]) => mockToastError(...args),
	},
}));

describe("IndicadorSync", () => {
	beforeEach(() => {
		mockEstado = {
			online: true,
			pendientes: 0,
			estado: "guardado",
			sincronizando: false,
		};
		mockPedirSync.mockClear();
		mockToastError.mockClear();
	});

	test("muestra sincronizado cuando no hay pendientes", () => {
		render(<IndicadorSync />);
		expect(screen.getByRole("button", { name: /Sincronizado ✓/i })).toBeInTheDocument();
	});

	test("muestra contador de pendientes", () => {
		mockEstado.pendientes = 3;
		mockEstado.estado = "guardando";
		render(<IndicadorSync />);
		expect(screen.getByText("3")).toBeInTheDocument();
	});

	test("click online dispara sincronización", () => {
		render(<IndicadorSync />);
		fireEvent.click(screen.getByRole("button"));
		expect(mockPedirSync).toHaveBeenCalledTimes(1);
		expect(mockToastError).not.toHaveBeenCalled();
	});

	test("click offline muestra toast y no sincroniza", () => {
		mockEstado.online = false;
		mockEstado.estado = "sin-conexion";
		render(<IndicadorSync />);
		fireEvent.click(screen.getByRole("button"));
		expect(mockPedirSync).not.toHaveBeenCalled();
		expect(mockToastError).toHaveBeenCalledWith("Sin conexión — no se puede sincronizar ahora");
	});

	test("deshabilita el botón mientras sincroniza", () => {
		mockEstado.sincronizando = true;
		render(<IndicadorSync />);
		expect(screen.getByRole("button")).toBeDisabled();
	});
});
