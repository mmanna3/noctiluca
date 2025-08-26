import { ReactNode } from "react";
import UseSeguridad from "../Pantallas/UseSeguridad";
import Login from "../Pantallas/login";

interface Props {
	children: ReactNode;
}

const ChequearSiRequierePassword = ({ children }: Props) => {
	const { tieneAcceso } = UseSeguridad();
	console.log("tiene acceso es:", tieneAcceso);

	if (!tieneAcceso) return <Login />;

	return <>{children}</>;
};

export default ChequearSiRequierePassword;
