export const generarKeyAPartirDeFecha = (fecha: Date) => {
	return fecha.toISOString().replace(/[^0-9]/g, "").slice(0, -3);
};

export const convertirASnakeCase = (txt: string) =>
	txt
		.toLowerCase()
		.replace(/[^a-z0-9 áéíóúÁÉÍÓÚ]/gi, "")
		.replace(/ /g, "_");