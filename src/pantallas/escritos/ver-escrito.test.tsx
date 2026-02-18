import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import VerEscrito from "./ver-escrito";

const mockVolverAEscritosHome = jest.fn();
const mockVolverAPapelera = jest.fn();

jest.mock("../../usar-navegacion", () => () => ({
	volverAEscritosHome: mockVolverAEscritosHome,
	volverAPapelera: mockVolverAPapelera,
	escritoId: "5",
	carpetaId: "1",
}));

let mockLocationPathname = "/1/escritos/ver/5";

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useLocation: () => ({
		pathname: mockLocationPathname,
	}),
}));

jest.mock("@/api/api", () => ({
	api: {},
}));

let mockQueryData: any = null;
let mockQueryIsLoading = false;
let mockQueryIsError = false;

jest.mock("@/api/custom-hooks/use-api-query", () => (props: any) => ({
	data: mockQueryData,
	isLoading: mockQueryIsLoading,
	isError: mockQueryIsError,
	refetch: jest.fn(),
}));

const mockMutateEdicion = jest.fn();
const mockMutateEliminacion = jest.fn();

jest.mock("@/api/custom-hooks/use-api-mutation", () => (props: any) => {
	if (props.mensajeDeExito?.includes("actualizado")) {
		return { mutate: mockMutateEdicion, isPending: false };
	}
	if (props.mensajeDeExito?.includes("eliminado") || props.mensajeDeExito?.includes("tacho")) {
		return { mutate: mockMutateEliminacion, isPending: false };
	}
	return { mutate: jest.fn(), isPending: false };
});

jest.mock("../../components/requiere-password", () => ({ children }: any) => <>{children}</>);

jest.mock("../../components/ui/modal-seleccionar-carpeta", () => (props: any) => (
	<div data-testid="modal-mover">Modal Mover</div>
));

jest.mock("@/api/clients", () => ({
	EscritoDTO: class {
		id: any;
		titulo: any;
		cuerpo: any;
		constructor(data: any) {
			this.id = data?.id;
			this.titulo = data?.titulo;
			this.cuerpo = data?.cuerpo;
		}
	},
}));

const renderComponent = () =>
	render(
		<MemoryRouter>
			<VerEscrito />
		</MemoryRouter>,
	);

beforeEach(() => {
	jest.clearAllMocks();
	mockLocationPathname = "/1/escritos/ver/5";
	mockQueryData = {
		id: 5,
		titulo: "Mi Escrito",
		cuerpo: "Contenido del escrito",
		carpetaId: 1,
		carpetaTitulo: "Mi Carpeta",
	};
	mockQueryIsLoading = false;
	mockQueryIsError = false;
});

describe("VerEscrito", () => {
	test("muestra titulo en encabezado", () => {
		renderComponent();
		expect(screen.getByText(/Mi Carpeta\/Mi Escrito/)).toBeInTheDocument();
	});

	test("input tiene valor del titulo", () => {
		renderComponent();
		expect(screen.getByDisplayValue("Mi Escrito")).toBeInTheDocument();
	});

	test("textarea tiene valor del cuerpo", () => {
		renderComponent();
		expect(screen.getByDisplayValue("Contenido del escrito")).toBeInTheDocument();
	});

	test("loading state", () => {
		mockQueryIsLoading = true;
		mockQueryData = null;
		renderComponent();
		expect(screen.getByText("Cargando...")).toBeInTheDocument();
	});

	test("error state", () => {
		mockQueryIsError = true;
		mockQueryData = null;
		renderComponent();
		expect(screen.getByText("Error al cargar el escrito")).toBeInTheDocument();
	});

	test("boton volver guarda cambios", () => {
		renderComponent();
		const botones = screen.getAllByRole("button");
		const botonVolver = botones.find((b) => b.textContent?.includes("Mi Carpeta"));
		expect(botonVolver).toBeDefined();
		fireEvent.click(botonVolver!);
		expect(mockMutateEdicion).toHaveBeenCalledWith(
			expect.objectContaining({
				id: 5,
				titulo: "Mi Escrito",
				cuerpo: "Contenido del escrito",
			}),
		);
	});

	test("boton eliminar llama mutate", () => {
		renderComponent();
		const botones = screen.getAllByRole("button");
		const botonEliminar = botones.find((b) => b.className.includes("border-none"));
		expect(botonEliminar).toBeDefined();
		fireEvent.click(botonEliminar!);
		expect(mockMutateEliminacion).toHaveBeenCalledWith(5);
	});

	test("desde papelera muestra Papelera en titulo", () => {
		mockLocationPathname = "/papelera/ver/5";
		renderComponent();
		expect(screen.getByText(/Papelera\/Mi Escrito/)).toBeInTheDocument();
	});

	test("boton mover abre modal", () => {
		renderComponent();
		expect(screen.queryByTestId("modal-mover")).not.toBeInTheDocument();
		const botones = screen.getAllByRole("button");
		const botonMover = botones.find(
			(b) => b.className.includes("text-slate-400") && b.className.includes("hover:bg-yellow-200"),
		);
		expect(botonMover).toBeDefined();
		fireEvent.click(botonMover!);
		expect(screen.getByTestId("modal-mover")).toBeInTheDocument();
	});

	test("cambiar titulo actualiza input", () => {
		renderComponent();
		const input = screen.getByDisplayValue("Mi Escrito");
		fireEvent.change(input, { target: { value: "Nuevo Titulo" } });
		expect(screen.getByDisplayValue("Nuevo Titulo")).toBeInTheDocument();
	});
});
