import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import NuevaCarpeta from "./nueva-carpeta";

const mockIrAlInicio = jest.fn();
const mockIrACarpeta = jest.fn();
const mockMutateCreacion = jest.fn();

let mockCarpetaId: string | undefined = undefined;

jest.mock("../../usar-navegacion", () => () => ({
	irAlInicio: mockIrAlInicio,
	irACarpeta: mockIrACarpeta,
	carpetaId: mockCarpetaId,
}));

jest.mock("@/api/api", () => ({
	api: {},
}));

jest.mock("@/api/clients", () => ({
	CarpetaDTO: class {
		titulo: string;
		carpetaPadreId: number | undefined;
		constructor(data: { titulo?: string; carpetaPadreId?: number }) {
			this.titulo = data?.titulo ?? "";
			this.carpetaPadreId = data?.carpetaPadreId;
		}
	},
}));

jest.mock("@/api/custom-hooks/use-api-mutation", () => () => ({
	mutate: mockMutateCreacion,
	isPending: false,
}));

const renderComponent = () =>
	render(
		<MemoryRouter>
			<NuevaCarpeta />
		</MemoryRouter>,
	);

beforeEach(() => {
	jest.clearAllMocks();
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
		expect(mockMutateCreacion).not.toHaveBeenCalled();
	});

	test("titulo vacio en subcarpeta navega a carpeta padre sin crear", () => {
		mockCarpetaId = "7";
		renderComponent();
		fireEvent.click(screen.getByText("Crear subcarpeta"));
		expect(mockIrACarpeta).toHaveBeenCalledWith(7);
		expect(mockMutateCreacion).not.toHaveBeenCalled();
	});

	test("con titulo llama mutate con datos de carpeta raiz", () => {
		renderComponent();
		const input = screen.getByPlaceholderText("Título");
		fireEvent.change(input, { target: { value: "Mi carpeta" } });
		fireEvent.click(screen.getByText("Crear carpeta"));
		expect(mockMutateCreacion).toHaveBeenCalledWith(
			expect.objectContaining({ titulo: "Mi carpeta", carpetaPadreId: undefined }),
		);
	});

	test("con titulo llama mutate con carpetaPadreId para subcarpeta", () => {
		mockCarpetaId = "3";
		renderComponent();
		const input = screen.getByPlaceholderText("Título");
		fireEvent.change(input, { target: { value: "Mi subcarpeta" } });
		fireEvent.click(screen.getByText("Crear subcarpeta"));
		expect(mockMutateCreacion).toHaveBeenCalledWith(
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
