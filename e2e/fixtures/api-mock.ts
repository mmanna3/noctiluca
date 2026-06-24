import { Page } from "@playwright/test";

const crearTokenJwtFake = () => {
	const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
	const payload = Buffer.from(
		JSON.stringify({ role: "Administrador", name: "e2e", exp: 4102444800 }),
	).toString("base64url");
	return `${header}.${payload}.firma-fake-e2e`;
};

export const autenticarEnPagina = async (page: Page) => {
	await page.addInitScript((token) => {
		localStorage.setItem(
			"auth-storage",
			JSON.stringify({
				state: {
					token,
					isAuthenticated: true,
					userRole: "Administrador",
					userName: "e2e",
				},
				version: 0,
			}),
		);
	}, crearTokenJwtFake());
};

export interface CarpetaMock {
	id: number;
	titulo: string;
	carpetaPadreId?: number | null;
	criterioDeOrden?: number;
	requiereAutenticacion?: boolean;
	cantidadDeEscritos?: number;
	cantidadDeSubCarpetas?: number;
	escritos?: { id: number; titulo: string; cuerpo?: string; carpetaId: number }[];
	subCarpetas?: CarpetaMock[];
}

export const configurarApiMock = async (
	page: Page,
	carpetas: Record<number, CarpetaMock>,
	escritosCreados: { carpetaId: number; titulo: string; cuerpo: string }[] = [],
) => {
	await page.route("**/api/**", async (route) => {
		const url = new URL(route.request().url());
		const metodo = route.request().method();
		const pathname = url.pathname;

		if (pathname.endsWith("/api/Carpeta") && metodo === "GET") {
			const raices = Object.values(carpetas).filter((c) => !c.carpetaPadreId);
			return route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify(raices),
			});
		}

		const matchCarpeta = pathname.match(/\/api\/Carpeta\/(\d+)$/);
		if (matchCarpeta && metodo === "GET") {
			const id = Number(matchCarpeta[1]);
			const carpeta = carpetas[id];
			if (!carpeta) {
				return route.fulfill({ status: 404, body: "No encontrada" });
			}
			return route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify(carpeta),
			});
		}

		if (pathname.endsWith("/api/Escrito") && metodo === "POST") {
			const body = route.request().postDataJSON() as {
				titulo?: string;
				cuerpo?: string;
				carpetaId?: number;
			};
			escritosCreados.push({
				carpetaId: body.carpetaId ?? 0,
				titulo: body.titulo ?? "",
				cuerpo: body.cuerpo ?? "",
			});
			return route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					id: 9000 + escritosCreados.length,
					titulo: body.titulo,
					cuerpo: body.cuerpo,
					carpetaId: body.carpetaId,
				}),
			});
		}

		if (pathname.match(/\/api\/Habito\/tracker/)) {
			return route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({ habitos: [] }),
			});
		}

		return route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({}),
		});
	});
};
