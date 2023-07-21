import { ReactNode } from "react";
import UseSeguridad from "../Pantallas/UseSeguridad";
import PedirPasswordPantalla from "../Pantallas/pedirPasswordPantalla";

interface Props {
    children: ReactNode;
}

const ChequearSiRequierePassword = ({children}: Props) => {

	const {tieneAcceso} = UseSeguridad();
	console.log("tiene acceso es:", tieneAcceso);

	if (!tieneAcceso)
		return <PedirPasswordPantalla />;

	return <>
		{children}
	</>;
};

export default ChequearSiRequierePassword;
