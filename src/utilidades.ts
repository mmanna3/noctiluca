export const generarKeyAPartirDeFecha = (fecha: Date) => {
	return fecha.toISOString().replace(/[^0-9]/g, "").slice(0, -3);
};

export const convertirEnKey = (txt: string) =>
	txt
		.trim()	
		.toLowerCase()
		.replace(/[^a-z0-9 áéíóúÁÉÍÓÚ_]/gi, "")
		.replace(/ /g, "_");