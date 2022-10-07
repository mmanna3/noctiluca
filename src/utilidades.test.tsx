import { convertirASnakeCase, generarKeyAPartirDeFecha } from "./utilidades";

test("generarKeyAPartirDeFecha", () => {
	const resultado = generarKeyAPartirDeFecha(new Date(2022, 2, 29, 15, 44, 31));
	expect(resultado).toBe("20220329184431"); // La hora es 18 en vez de 15 por el GMT-3
});

test("convertirASnakeCase: Espacios y mayúsculas en el medio", () => {
	const resultado = convertirASnakeCase("Las campanas no doblan por nadie");
	expect(resultado).toBe("las_campanas_no_doblan_por_nadie");
});

test("convertirASnakeCase: Elimina comas, puntos y signos de interrogación y admiración", () => {
	const resultado = convertirASnakeCase("¡Hola!, ¿cómo estás?.");
	expect(resultado).toBe("hola_cómo_estás");
});
