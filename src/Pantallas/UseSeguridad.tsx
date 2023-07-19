import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import { configuracion } from "../firebase";
import usarNavegacion from "../usarNavegacion";
import { fechaEsDeHaceMenosDe5Minutos } from "../utilidades";

const CARPETAS_QUE_REQUIEREN_ACCESO = ["Ξ", "diario"]; 

const UseSeguridad = ()  => {
	const [tieneAcceso, setTieneAcceso] = useState<boolean>();
	const {estado} = useAppContext(); 
	const {carpetaId} = usarNavegacion();

	useEffect(() => {
		const obtenerPasswordCorrecto = async () => {
			const passwordCorrecto = await configuracion.obtenerPassword();

			console.log("el password de la config es: ", passwordCorrecto);

			if ((carpetaId && !CARPETAS_QUE_REQUIEREN_ACCESO.includes(carpetaId)) || (
				estado.password == passwordCorrecto && 
				estado.fechaHoraQueIngresoElPassword && 
				fechaEsDeHaceMenosDe5Minutos(new Date(estado.fechaHoraQueIngresoElPassword)))) {
				setTieneAcceso(true);
				console.log("seteando tiene acceso en true");
			}
				
			else 
				setTieneAcceso(false);

		};
          
		obtenerPasswordCorrecto();
		console.log("useEffect useSeguridad");
          
	}, [estado]);

	return {tieneAcceso};
};

export default UseSeguridad;