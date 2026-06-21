import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import VerCarpeta from "./ver-carpeta";

const mockIrAlInicio = jest.fn();
const mockIrANuevoEscrito = jest.fn();
const mockIrACarpeta = jest.fn();
const mockIrANuevaSubcarpeta = jest.fn();
const mockMutateEliminacion = jest.fn();
const mockMutateActualizarCriterio = jest.fn();
const mockRefetch = jest.fn();

jest.mock("../../usar-navegacion", () => () => ({
	irAlInicio: mockIrAlInicio,
	irANuevoEscrito: mockIrANuevoEscrito,
	irACarpeta: mockIrACarpeta,
	irANuevaSubcarpeta: mockIrANuevaSubcarpeta,
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

jest.mock("@/api/custom-hooks/use-api-query", () => () => ({
	data: mockQueryData,
	isLoading: mockQueryIsLoading,
	isError: mockQueryIsError,
	refetch: mockRefetch,
}));

jest.mock("@/api/custom-hooks/use-api-mutation", () => (props: { mensajeDeExito?: string }) => {
	if (props.mensajeDeExito?.includes("eliminada")) {
		return { mutate: mockMutateEliminacion, isPending: false };
	}
	if (props.mensajeDeExito?.includes("Criterio")) {
		return { mutate: mockMutateActualizarCriterio, isPending: false };
	}
	return { mutate: jest.fn(), isPending: false };
});

jest.mock("../../components/requiere-password", () => {
	function MockRequierePassword({ children }: { children: React.ReactNode }) {
		return <>{children}</>;
	}
	return MockRequierePassword;
});

jest.mock("../../components/ui/modal-seleccionar-carpeta", () => {
	function MockModalSeleccionarCarpeta() {
		return <div data-testid="modal-mover">Modal Mover</div>;
	}
	return MockModalSeleccionarCarpeta;
});

jest.mock("../../components/ui/selector-criterio-orden", () => {
	function MockSelectorCriterioOrden() {
		return <div data-testid="selector-criterio-orden">SelectorCriterioOrden</div>;
	}
	return MockSelectorCriterioOrden;
});

jest.mock("./lista", () => {
	function MockListaSubcarpetas(props: { data?: { id: number; titulo: string }[] }) {
		return (
			<div data-testid="lista-subcarpetas">
				{(props.data || []).map((c) => (
					<div key={c.id} data-testid={`subcarpeta-${c.id}`}>
						{c.titulo}
					</div>
				))}
			</div>
		);
	}
	return MockListaSubcarpetas;
});

jest.mock("../escritos/lista", () => {
	function MockListaEscritos(props: {
		data?: { id: number; titulo: string }[];
		onToggleSeleccion?: (id: number) => void;
		onLongPress?: (id: number) => void;
	}) {
		return (
			<div data-testid="lista-escritos">
				{(props.data || []).map((e) => (
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
		);
	}
	return MockListaEscritos;
});

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
		cantidadDeSubCarpetas: 0,
		criterioDeOrden: 1,
		carpetaPadreId: null,
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
		// El botón de nuevo escrito (PlusIcon) es el último rounded-full
		// (el primero es el de nueva subcarpeta para carpetas raíz)
		const botonesIcono = screen.getAllByRole("button");
		const botonesRoundedFull = botonesIcono.filter((b) => b.className.includes("rounded-full"));
		const botonPlus = botonesRoundedFull[botonesRoundedFull.length - 1];
		expect(botonPlus).toBeDefined();
		if (!botonPlus) return;
		fireEvent.click(botonPlus);
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
		if (!botonHerramientas) return;
		fireEvent.click(botonHerramientas);
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
		if (!botonCancelar) return;
		fireEvent.click(botonCancelar);
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

	test("muestra subcarpetas cuando carpeta raiz tiene subcarpetas", () => {
		mockQueryData = {
			...mockQueryData,
			subCarpetas: [
				{ id: 100, titulo: "Sub A" },
				{ id: 200, titulo: "Sub B" },
			],
			cantidadDeSubCarpetas: 2,
		};
		renderComponent();
		expect(screen.getByTestId("lista-subcarpetas")).toBeInTheDocument();
		expect(screen.getByTestId("subcarpeta-100")).toBeInTheDocument();
		expect(screen.getByTestId("subcarpeta-200")).toBeInTheDocument();
	});

	test("no muestra boton nueva subcarpeta cuando es subcarpeta", () => {
		mockQueryData = {
			...mockQueryData,
			carpetaPadreId: 5,
		};
		renderComponent();
		// Para subcarpetas, onNuevaSubcarpeta es undefined → botón no se renderiza
		// Solo hay un boton rounded-full: el de nuevo escrito
		const botonesIcono = screen.getAllByRole("button");
		const botonesRoundedFull = botonesIcono.filter((b) => b.className.includes("rounded-full"));
		expect(botonesRoundedFull).toHaveLength(1);
	});

	test("muestra boton nueva subcarpeta cuando es carpeta raiz", () => {
		// carpetaPadreId: null → carpeta raiz → se muestran dos botones round (subcarpeta + escrito)
		renderComponent();
		const botonesIcono = screen.getAllByRole("button");
		const botonesRoundedFull = botonesIcono.filter((b) => b.className.includes("rounded-full"));
		expect(botonesRoundedFull).toHaveLength(2);
	});

	test("boton volver en subcarpeta llama irACarpeta con id del padre", () => {
		mockQueryData = {
			...mockQueryData,
			carpetaPadreId: 42,
		};
		renderComponent();
		const botonVolver = screen.getByText(/\/Mi Carpeta/);
		fireEvent.click(botonVolver);
		expect(mockIrACarpeta).toHaveBeenCalledWith(42);
		expect(mockIrAlInicio).not.toHaveBeenCalled();
	});

	test("estado vacio sin escritos ni subcarpetas muestra opcion eliminar", () => {
		mockQueryData = {
			id: 1,
			titulo: "Vacia",
			escritos: [],
			cantidadDeEscritos: 0,
			subCarpetas: [],
			cantidadDeSubCarpetas: 0,
			carpetaPadreId: null,
		};
		renderComponent();
		expect(screen.getByText(/No hay escritos/)).toBeInTheDocument();
		expect(screen.getByText("¿Eliminar carpeta?")).toBeInTheDocument();
	});

	test("carpeta con subcarpetas pero sin escritos no muestra estado vacio", () => {
		mockQueryData = {
			id: 1,
			titulo: "Solo sub",
			escritos: [],
			cantidadDeEscritos: 0,
			subCarpetas: [{ id: 99, titulo: "Sub" }],
			cantidadDeSubCarpetas: 1,
			carpetaPadreId: null,
		};
		renderComponent();
		expect(screen.queryByText("¿Eliminar carpeta?")).not.toBeInTheDocument();
		expect(screen.getByTestId("lista-subcarpetas")).toBeInTheDocument();
	});
});
