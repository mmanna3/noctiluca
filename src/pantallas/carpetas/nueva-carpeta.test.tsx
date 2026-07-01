import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import NuevaCarpeta from "./nueva-carpeta";

const mockIrAlInicio = vi.fn();
const mockIrACarpeta = vi.fn();
const mockCrearCarpetaLocal = vi.fn().mockResolvedValue("guid-nueva");

let mockCarpetaId: string | undefined = undefined;

vi.mock("../../usar-navegacion", () => ({
	default: () => ({
		irAlInicio: mockIrAlInicio,
		irACarpeta: mockIrACarpeta,
		carpetaId: mockCarpetaId,
	}),
}));

vi.mock("@/sync/repositorio-carpetas", () => ({
	crearCarpetaLocal: (...args: unknown[]) => mockCrearCarpetaLocal(...args),
}));

vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));

const renderComponent = () =>
	render(
		<MemoryRouter>
			<NuevaCarpeta />
		</MemoryRouter>,
	);

beforeEach(() => {
	vi.clearAllMocks();
	mockCarpetaId = undefined;
});

describe("NuevaCarpeta", () => {
	test("muestra 'Crear carpeta' cuando no hay carpetaId", () => {
		renderComponent();
		expect(screen.getByText("Crear carpeta")).toBeInTheDocument();
	});

	test("muestra 'Crear subcarpeta' cuando hay carpetaId", () => {
		mockCarpetaId = "5";
		renderComponent();
		expect(screen.getByText("Crear subcarpeta")).toBeInTheDocument();
	});

	test("input de titulo empieza vacio", () => {
		renderComponent();
		const input = screen.getByPlaceholderText("Título");
		expect(input).toHaveValue("");
	});

	test("titulo vacio en carpeta raiz navega al inicio sin crear", () => {
		renderComponent();
		fireEvent.click(screen.getByText("Crear carpeta"));
		expect(mockIrAlInicio).toHaveBeenCalled();
		expect(mockCrearCarpetaLocal).not.toHaveBeenCalled();
	});

	test("titulo vacio en subcarpeta navega a carpeta padre sin crear", () => {
		mockCarpetaId = "7";
		renderComponent();
		fireEvent.click(screen.getByText("Crear subcarpeta"));
		expect(mockIrACarpeta).toHaveBeenCalledWith(7);
		expect(mockCrearCarpetaLocal).not.toHaveBeenCalled();
	});

	test("con titulo crea carpeta raiz en local", () => {
		renderComponent();
		const input = screen.getByPlaceholderText("Título");
		fireEvent.change(input, { target: { value: "Mi carpeta" } });
		fireEvent.click(screen.getByText("Crear carpeta"));
		expect(mockCrearCarpetaLocal).toHaveBeenCalledWith(
			expect.objectContaining({ titulo: "Mi carpeta", carpetaPadreId: undefined }),
		);
	});

	test("con titulo crea subcarpeta con carpetaPadreId en local", () => {
		mockCarpetaId = "3";
		renderComponent();
		const input = screen.getByPlaceholderText("Título");
		fireEvent.change(input, { target: { value: "Mi subcarpeta" } });
		fireEvent.click(screen.getByText("Crear subcarpeta"));
		expect(mockCrearCarpetaLocal).toHaveBeenCalledWith(
			expect.objectContaining({ titulo: "Mi subcarpeta", carpetaPadreId: 3 }),
		);
	});

	test("cambiar titulo actualiza el input", () => {
		renderComponent();
		const input = screen.getByPlaceholderText("Título");
		fireEvent.change(input, { target: { value: "Nuevo titulo" } });
		expect(input).toHaveValue("Nuevo titulo");
	});
});
