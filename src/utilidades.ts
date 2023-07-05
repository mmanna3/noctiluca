export const generarKeyAPartirDeFecha = (fecha: Date) => {
	return fecha.toISOString().replace(/[^0-9]/g, "").slice(0, -3);
};

export const convertirEnKey = (txt: string) =>
	txt
		.trim()	
		.toLowerCase()
		.replace(/[^a-z0-9 áéíóúÁÉÍÓÚ_]/gi, "")
		.replace(/ /g, "_");

export const tieneAccesoAlDiario = () => {
	const password = localStorage.getItem("noctiluca.diario.password.valor");
	const fechaPassword = localStorage.getItem("noctiluca.diario.password.fecha");

	console.log("tiene acceso al diario", process.env.REACT_APP_DIARIO_PASSWORD);

	return password == process.env.REACT_APP_DIARIO_PASSWORD && fechaPassword && fechaEsDeHaceMenosDe5Minutos(new Date(fechaPassword));
};

export const validarPasswordYEscribirloEnLocalStorage = (password: string) : boolean => {
	
	if (password === process.env.REACT_APP_DIARIO_PASSWORD) {
		localStorage.setItem("noctiluca.diario.password.valor", password);
		localStorage.setItem("noctiluca.diario.password.fecha", new Date().toString());
		return true;
	} 

	return false;
};

export const fechaEsDeHaceMenosDe5Minutos = (fecha: Date): boolean => {
	const cincoMinutos = 1000 * 60 * 5;
	const horaHace5Minutos = Date.now() - cincoMinutos;

	return fecha > new Date(horaHace5Minutos);
};