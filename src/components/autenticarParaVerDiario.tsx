import Encabezado from "./encabezado";
import Cuerpo from "./cuerpo";
import { validarPasswordYEscribirloEnLocalStorage } from "../utilidades";
import { useMemo, useState } from "react";

interface Props {
    cuandoAutentica: () => void;
}

const AutenticarParaVerDiario = ({cuandoAutentica}: Props) => {

	const [hayError, setHayError] = useState(false);
	const [password, setPassword] = useState("");

	useMemo(() => {
		if (password.length === 4)
			if (validarPasswordYEscribirloEnLocalStorage(password))
				cuandoAutentica();
			else
				setHayError(true);
	}, [password]);

	return <>
		<Encabezado>
			<div className="px-2">Esta es una sección protegida que requiere contraseña</div>
		</Encabezado>
		<Cuerpo>
			<div className="mb-6">
				<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline" id="password" value={password} onChange={(texto) => setPassword(texto.target.value)} type="password" placeholder="******************" />
				{hayError && <p className="text-red-500 text-sm pl-1">Contraseña incorrecta bro</p>}
			</div>
		</Cuerpo>
	</>;
};

export default AutenticarParaVerDiario;
