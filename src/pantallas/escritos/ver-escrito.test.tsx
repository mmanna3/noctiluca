import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import VerEscrito from "./ver-escrito";

const mockVolverAEscritosHome = vi.fn();
const mockVolverAPapelera = vi.fn();

vi.mock("../../usar-navegacion", () => ({
	default: () => ({
		volverAEscritosHome: mockVolverAEscritosHome,
		volverAPapelera: mockVolverAPapelera,
		escritoId: "5",
		carpetaId: "1",
	}),
}));

let mockLocationPathname = "/1/escritos/ver/5";

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
	return {
		...actual,
		useLocation: () => ({
			pathname: mockLocationPathname,
		}),
	};
});

vi.mock("@/api/api", () => ({
	api: { escritoGET: vi.fn().mockResolvedValue(null) },
}));

vi.mock("@/sync/estado-sync", () => ({
	useEstadoSync: (selector: (s: { estado: string }) => unknown) => selector({ estado: "guardado" }),
}));

const mockSembrarEscrito = vi.fn();
const mockCambiarPapeleraLocal = vi.fn().mockResolvedValue(undefined);
const mockEliminarEscritoLocal = vi.fn().mockResolvedValue(undefined);
vi.mock("@/sync/repositorio-escritos", () => ({
	sembrarEscrito: (...args: unknown[]) => mockSembrarEscrito(...args),
	cambiarPapeleraLocal: (...args: unknown[]) => mockCambiarPapeleraLocal(...args),
	eliminarEscritoLocal: (...args: unknown[]) => mockEliminarEscritoLocal(...args),
}));

vi.mock("@/sync/pedir-sync", () => ({
	pedirSync: vi.fn(),
}));

vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));

const mockFlush = vi.fn().mockResolvedValue(undefined);
vi.mock("./usar-autoguardado", () => ({
	usarAutoguardado: () => ({ flush: mockFlush }),
}));

let mockEscrito: any = null;

vi.mock("@/sync/lecturas", () => ({
	usarEscrito: () => mockEscrito,
}));

vi.mock("../../components/requiere-password", () => ({
	default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("../../components/ui/modal-seleccionar-carpeta", () => ({
	default: () => <div data-testid="modal-mover">Modal Mover</div>,
}));

vi.mock("@/api/clients", () => ({
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
	vi.clearAllMocks();
	mockLocationPathname = "/1/escritos/ver/5";
	mockEscrito = {
		id: 5,
		clientId: "guid-5",
		titulo: "Mi Escrito",
		cuerpo: "Contenido del escrito",
		carpetaId: 1,
		carpetaTitulo: "Mi Carpeta",
	};
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
		mockEscrito = undefined;
		renderComponent();
		expect(screen.getByText("Cargando...")).toBeInTheDocument();
	});

	test("no encontrado cuando no está en local y no se puede sembrar", () => {
		mockEscrito = null;
		const original = navigator.onLine;
		Object.defineProperty(navigator, "onLine", { value: false, configurable: true });
		renderComponent();
		expect(screen.getByText("No se encontró el escrito")).toBeInTheDocument();
		Object.defineProperty(navigator, "onLine", { value: original, configurable: true });
	});

	test("boton volver hace flush del autoguardado y navega (ya no persiste el botón)", () => {
		renderComponent();
		const botones = screen.getAllByRole("button");
		const botonVolver = botones.find((b) => b.textContent?.includes("Mi Carpeta"));
		expect(botonVolver).toBeDefined();
		if (!botonVolver) return;
		fireEvent.click(botonVolver);
		expect(mockFlush).toHaveBeenCalled();
		expect(mockVolverAEscritosHome).toHaveBeenCalled();
	});

	test("muestra el indicador de estado de guardado", () => {
		renderComponent();
		expect(screen.getByText("Guardado")).toBeInTheDocument();
	});

	test("boton eliminar manda a papelera en local", () => {
		renderComponent();
		const botones = screen.getAllByRole("button");
		const botonEliminar = botones.find((b) => b.className.includes("border-none"));
		expect(botonEliminar).toBeDefined();
		if (!botonEliminar) return;
		fireEvent.click(botonEliminar);
		expect(mockCambiarPapeleraLocal).toHaveBeenCalledWith("guid-5", true);
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
		if (!botonMover) return;
		fireEvent.click(botonMover);
		expect(screen.getByTestId("modal-mover")).toBeInTheDocument();
	});

	test("cambiar titulo actualiza input", () => {
		renderComponent();
		const input = screen.getByDisplayValue("Mi Escrito");
		fireEvent.change(input, { target: { value: "Nuevo Titulo" } });
		expect(screen.getByDisplayValue("Nuevo Titulo")).toBeInTheDocument();
	});
});
