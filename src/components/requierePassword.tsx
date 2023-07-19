import { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import usarNavegacion from "../usarNavegacion";

import PedirPasswordPantalla from "../Pantallas/pedirPasswordPantalla";
import { useAppContext } from "../AppContext";
import UseSeguridad from "../Pantallas/UseSeguridad";

interface Props {
    children: ReactNode;
}

const ChequearSiRequierePassword = ({children}: Props) => {

	const {carpetaId} = usarNavegacion();	
	const [tieneAcceso, setTieneAcceso] = useState(false);
	const {estado} = useAppContext(); 
	const {tieneAccesoAlDiario} = UseSeguridad();

	useMemo(() => console.log("nuevo password es", estado), [estado]);
	useMemo(() => {
		console.log("RequierePassword: el estado es:", estado.password);
		console.log("RequierePassword: carpetaId es:", carpetaId);
		console.log("Tiene acceso", tieneAcceso);
		if ((carpetaId !== "diario" && carpetaId !== "Ξ"))
			setTieneAcceso(true);
		else {
			setTieneAcceso(tieneAccesoAlDiario());
		} 	
			
	}, [estado, carpetaId]);
    
	if (!tieneAcceso)
		return <PedirPasswordPantalla />;

	return <>
		{children}
	</>;
};

export default ChequearSiRequierePassword;
