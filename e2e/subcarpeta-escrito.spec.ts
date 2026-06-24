import { expect, test } from "@playwright/test";
import { autenticarEnPagina, configurarApiMock, type CarpetaMock } from "./fixtures/api-mock";

const CARPETA_RAIZ_ID = 1;
const SUBCARPETA_ID = 42;

const carpetasMock: Record<number, CarpetaMock> = {
	[CARPETA_RAIZ_ID]: {
		id: CARPETA_RAIZ_ID,
		titulo: "Proyectos",
		carpetaPadreId: null,
		criterioDeOrden: 1,
		requiereAutenticacion: false,
		cantidadDeEscritos: 0,
		cantidadDeSubCarpetas: 1,
		escritos: [],
		subCarpetas: [
			{
				id: SUBCARPETA_ID,
				titulo: "Mis notas / personal",
				carpetaPadreId: CARPETA_RAIZ_ID,
				cantidadDeEscritos: 0,
			},
		],
	},
	[SUBCARPETA_ID]: {
		id: SUBCARPETA_ID,
		titulo: "Mis notas / personal",
		carpetaPadreId: CARPETA_RAIZ_ID,
		criterioDeOrden: 1,
		requiereAutenticacion: false,
		cantidadDeEscritos: 0,
		cantidadDeSubCarpetas: 0,
		escritos: [],
		subCarpetas: [],
	},
};

test.describe("escritos en subcarpetas", () => {
	test("crea un escrito dentro de una subcarpeta", async ({ page }) => {
		const escritosCreados: { carpetaId: number; titulo: string; cuerpo: string }[] = [];

		await autenticarEnPagina(page);
		await configurarApiMock(page, carpetasMock, escritosCreados);

		await page.goto(`/#/${SUBCARPETA_ID}/escritos`);

		await expect(page.getByText(/\/Mis notas \/ personal/)).toBeVisible();

		const botonNuevo = page.locator("button.rounded-full").last();
		await botonNuevo.click();

		await expect(page).toHaveURL(new RegExp(`/#/${SUBCARPETA_ID}/nuevo$`));
		await expect(page.getByText("Crear en /Mis notas / personal")).toBeVisible();

		await page.getByPlaceholder("Título").fill("Nota en subcarpeta");
		await page.getByPlaceholder("Texto").fill("Contenido de prueba");
		await page.getByRole("button", { name: /Crear en/ }).click();

		await expect(page).toHaveURL(new RegExp(`/#/${SUBCARPETA_ID}/escritos$`));
		expect(escritosCreados).toHaveLength(1);
		expect(escritosCreados[0]).toEqual({
			carpetaId: SUBCARPETA_ID,
			titulo: "Nota en subcarpeta",
			cuerpo: "Contenido de prueba",
		});
	});

	test("navega desde carpeta raiz a subcarpeta y crea escrito", async ({ page }) => {
		const escritosCreados: { carpetaId: number; titulo: string; cuerpo: string }[] = [];

		await autenticarEnPagina(page);
		await configurarApiMock(page, carpetasMock, escritosCreados);

		await page.goto(`/#/${CARPETA_RAIZ_ID}/escritos`);
		await page.getByText("Mis notas / personal").click();

		await expect(page).toHaveURL(new RegExp(`/#/${SUBCARPETA_ID}/escritos$`));

		const botonNuevo = page.locator("button.rounded-full").last();
		await botonNuevo.click();
		await expect(page).toHaveURL(new RegExp(`/#/${SUBCARPETA_ID}/nuevo$`));

		await page.getByPlaceholder("Título").fill("Otra nota");
		await page.getByRole("button", { name: /Crear en/ }).click();

		expect(escritosCreados[0]?.carpetaId).toBe(SUBCARPETA_ID);
	});
});
