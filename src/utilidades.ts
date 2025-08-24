export const generarKeyAPartirDeFecha = (fecha: Date) => {
	return fecha
		.toISOString()
		.replace(/[^0-9]/g, "")
		.slice(0, -3);
};

export const convertirEnKey = (txt: string) =>
	txt
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9 áéíóúÁÉÍÓÚ_]/gi, "")
		.replace(/ /g, "_");

export const tieneAccesoAlDiario = async (): Promise<boolean> => {
	// const password = localStorage.getItem("noctiluca.diario.password.valor");
	// const fechaPassword = localStorage.getItem("noctiluca.diario.password.fecha");

	// const passwordGuardado = await configuracion.obtenerPassword();

	// if (password == passwordGuardado && fechaPassword && fechaEsDeHaceMenosDe5Minutos(new Date(fechaPassword)))
	// 	return true;
	// else
	return false;
};

export const validarPasswordYEscribirloEnLocalStorage = (password: string): boolean => {
	console.log(
		"validarPasswordYEscribirloEnLocalStorage",
		password === process.env.REACT_APP_DIARIO_PASSWORD,
	);

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

export const passwordEsValido = (password: string) => {
	if (password === process.env.REACT_APP_DIARIO_PASSWORD) {
		return true;
	}

	return false;
};
