import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import usarNavegacion from "../usarNavegacion";
import { fechaEsDeHaceMenosDe5Minutos } from "../utilidades";

const CARPETAS_QUE_REQUIEREN_ACCESO = ["Ξ", "diario", "consejos_de_mí_para_mí"]; 

const UseSeguridad = ()  => {
	const [tieneAcceso, setTieneAcceso] = useState<boolean>(true);
	const {estado} = useAppContext(); 
	const {carpetaId} = usarNavegacion();

	useEffect(() => {
		const obtenerPasswordCorrecto = () => {
			if ((carpetaId && !CARPETAS_QUE_REQUIEREN_ACCESO.includes(carpetaId)) || (
				estado.fechaHoraQueIngresoElPassword && 
				fechaEsDeHaceMenosDe5Minutos(new Date(estado.fechaHoraQueIngresoElPassword)))) {
				setTieneAcceso(true);
				console.log("seteando tiene acceso en true");
			} else 
				setTieneAcceso(false);
		};
          
		obtenerPasswordCorrecto();
		console.log("useEffect useSeguridad");
          
	}, [estado]);

	return {tieneAcceso};
};

export default UseSeguridad;