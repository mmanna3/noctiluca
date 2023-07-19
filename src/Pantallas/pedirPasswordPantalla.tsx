import Encabezado from "../components/encabezado";
import Cuerpo from "../components/cuerpo";
import { passwordEsValido } from "../utilidades";
import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";


const PedirPasswordPantalla = () => {

	const [hayError, setHayError] = useState(false);
	const [password, setPassword] = useState("");
	const {cambiarEstado} = useAppContext(); 


	useEffect(() => {
		if (password.length === 4)
			if (passwordEsValido(password)) {
				console.log("el password es correcto");
				cambiarEstado({password: password, fechaHoraQueIngresoElPassword: new Date().toString()});
			} else
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

export default PedirPasswordPantalla;
