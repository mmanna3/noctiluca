import { useState, useEffect } from "react";
import { useAppContext } from "../AppContext";
import { configuracion } from "../firebase";
import { fechaEsDeHaceMenosDe5Minutos } from "../utilidades";

const UseSeguridad = ()  => {
	const [passwordCorrecto, setPasswordCorrecto] = useState<string>();
	const {estado} = useAppContext(); 

	useEffect(() => {
		const obtenerPassword = async () => {
			const password = await configuracion.obtenerPassword();
			if (password != undefined)
				setPasswordCorrecto(password);
		};
          
		obtenerPassword();
          
	}, []);


	const tieneAccesoAlDiario = (): boolean => {
    
		if (estado.password == passwordCorrecto && estado.fechaHoraQueIngresoElPassword && fechaEsDeHaceMenosDe5Minutos(new Date(estado.fechaHoraQueIngresoElPassword)))
			return true;
		else 
			return false;
	};

	return {tieneAccesoAlDiario};
};

export default UseSeguridad;