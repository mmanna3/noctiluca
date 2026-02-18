import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import VerCarpeta from "./ver-carpeta";

const mockIrAlInicio = jest.fn();
const mockIrANuevoEscrito = jest.fn();
const mockMutateEliminacion = jest.fn();
const mockMutateActualizarCriterio = jest.fn();
const mockRefetch = jest.fn();

jest.mock("../../usar-navegacion", () => () => ({
	irAlInicio: mockIrAlInicio,
	irANuevoEscrito: mockIrANuevoEscrito,
	carpetaId: "1",
}));

jest.mock("@/api/api", () => ({
	api: {},
}));

jest.mock("@/api/clients", () => ({
	CriterioDeOrdenEnum: { _1: 1, _2: 2, _3: 3, _4: 4, _5: 5, _6: 6 },
}));

let mockQueryData: any = null;
let mockQueryIsLoading = false;
let mockQueryIsError = false;

jest.mock("@/api/custom-hooks/use-api-query", () => (props: any) => ({
	data: mockQueryData,
	isLoading: mockQueryIsLoading,
	isError: mockQueryIsError,
	refetch: mockRefetch,
}));

jest.mock("@/api/custom-hooks/use-api-mutation", () => (props: any) => {
	if (props.mensajeDeExito?.includes("eliminada")) {
		return { mutate: mockMutateEliminacion, isPending: false };
	}
	if (props.mensajeDeExito?.includes("Criterio")) {
		return { mutate: mockMutateActualizarCriterio, isPending: false };
	}
	return { mutate: jest.fn(), isPending: false };
});

jest.mock("../../components/requiere-password", () => ({ children }: any) => <>{children}</>);

jest.mock("../../components/ui/modal-seleccionar-carpeta", () => (props: any) => (
	<div data-testid="modal-mover">Modal Mover</div>
));

jest.mock("../../components/ui/selector-criterio-orden", () => (props: any) => (
	<div data-testid="selector-criterio-orden">SelectorCriterioOrden</div>
));

jest.mock("../escritos/lista", () => (props: any) => (
	<div data-testid="lista-escritos">
		{(props.data || []).map((e: any) => (
			<button
				key={e.id}
				data-testid={`escrito-${e.id}`}
				onClick={() => props.onToggleSeleccion?.(e.id)}
				onContextMenu={() => props.onLongPress?.(e.id)}
			>
				{e.titulo}
			</button>
		))}
	</div>
));

const renderComponent = () =>
	render(
		<MemoryRouter>
			<VerCarpeta />
		</MemoryRouter>,
	);

beforeEach(() => {
	jest.clearAllMocks();
	mockQueryData = {
		id: 1,
		titulo: "Mi Carpeta",
		escritos: [
			{ id: 10, titulo: "Escrito 1" },
			{ id: 20, titulo: "Escrito 2" },
		],
		cantidadDeEscritos: 2,
		criterioDeOrden: 1,
	};
	mockQueryIsLoading = false;
	mockQueryIsError = false;
});

describe("VerCarpeta", () => {
	test("muestra titulo de carpeta", () => {
		renderComponent();
		expect(screen.getByText(/\/Mi Carpeta/)).toBeInTheDocument();
	});

	test("muestra lista de escritos", () => {
		renderComponent();
		expect(screen.getByTestId("lista-escritos")).toBeInTheDocument();
	});

	test("estado vacio sin escritos", () => {
		mockQueryData = {
			id: 1,
			titulo: "Mi Carpeta",
			escritos: [],
			cantidadDeEscritos: 0,
		};
		renderComponent();
		expect(screen.getByText(/No hay escritos/)).toBeInTheDocument();
		expect(screen.getByText("¿Eliminar carpeta?")).toBeInTheDocument();
	});

	test("boton eliminar carpeta llama mutate", () => {
		mockQueryData = {
			id: 1,
			titulo: "Mi Carpeta",
			escritos: [],
			cantidadDeEscritos: 0,
		};
		renderComponent();
		fireEvent.click(screen.getByText("¿Eliminar carpeta?"));
		expect(mockMutateEliminacion).toHaveBeenCalledWith(1);
	});

	test("boton + llama irANuevoEscrito", () => {
		renderComponent();
		// El BotonIcono contiene el PlusIcon, buscar por el icono no es posible,
		// pero sabemos que BotonIcono es un boton con clase rounded-full
		const botonesIcono = screen.getAllByRole("button");
		const botonPlus = botonesIcono.find((b) =>
			b.className.includes("rounded-full"),
		);
		expect(botonPlus).toBeDefined();
		fireEvent.click(botonPlus!);
		expect(mockIrANuevoEscrito).toHaveBeenCalledWith("Mi Carpeta");
	});

	test("herramientas ocultas por defecto", () => {
		renderComponent();
		expect(screen.queryByTestId("selector-criterio-orden")).not.toBeInTheDocument();
	});

	test("boton herramientas muestra selector", () => {
		renderComponent();
		// El boton de herramientas es el que tiene AdjustmentsHorizontalIcon
		// Buscar todos los botones y encontrar el de herramientas
		const botones = screen.getAllByRole("button");
		// El boton de herramientas no tiene texto, es un icono SVG
		// Es el tercer boton (despues del de volver y el de nuevo)
		const botonHerramientas = botones.find(
			(b) => !b.className.includes("rounded-full") && !b.className.includes("soloBorde") && b.textContent === "",
		);
		expect(botonHerramientas).toBeDefined();
		fireEvent.click(botonHerramientas!);
		expect(screen.getByTestId("selector-criterio-orden")).toBeInTheDocument();
	});

	test("long press activa modo seleccion", () => {
		renderComponent();
		const escrito1 = screen.getByTestId("escrito-10");
		fireEvent.contextMenu(escrito1);
		expect(screen.getByText(/seleccionado/)).toBeInTheDocument();
	});

	test("boton cancelar vuelve a modo normal", () => {
		renderComponent();
		// Activar modo seleccion
		const escrito1 = screen.getByTestId("escrito-10");
		fireEvent.contextMenu(escrito1);
		expect(screen.getByText(/seleccionado/)).toBeInTheDocument();

		// Buscar el boton X (cancelar)
		const botones = screen.getAllByRole("button");
		const botonCancelar = botones.find(
			(b) => b.className.includes("text-slate-400"),
		);
		expect(botonCancelar).toBeDefined();
		fireEvent.click(botonCancelar!);
		expect(screen.getByText(/\/Mi Carpeta/)).toBeInTheDocument();
	});

	test("boton Todos selecciona todos", () => {
		renderComponent();
		// Activar modo seleccion
		fireEvent.contextMenu(screen.getByTestId("escrito-10"));
		expect(screen.getByText("1 seleccionado")).toBeInTheDocument();

		fireEvent.click(screen.getByText("Todos"));
		expect(screen.getByText("2 seleccionados")).toBeInTheDocument();
	});
});
