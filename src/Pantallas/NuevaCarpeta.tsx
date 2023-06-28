import { useState } from "react";
import { crearCarpeta } from "../firebase";
import usarNavegacion from "../usarNavegacion";
import Encabezado from "../components/encabezado";
import { Boton } from "../components/botones";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Cuerpo from "../components/cuerpo";
import Input from "../components/input";

const NuevaCarpeta = () => {

	const {irACarpetasHome } = usarNavegacion();
	const [titulo, setTitulo] = useState("");
	const [errorTitulo, setErrorTitulo] = useState("");

	const crearYVolver = async () => {		
		if (titulo === "")
			irACarpetasHome();
		
		const error = await crearCarpeta(titulo);
		setErrorTitulo(error);
		if (error === "")
			irACarpetasHome();
	};

	const cuandoCambie = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitulo(e.target.value);
		setErrorTitulo("");
	};

	return <>
		<Encabezado>
			<Boton soloBorde className="flex justify-between items-center" onClick={crearYVolver}>
				<ChevronLeftIcon className="w-4 h-4 mr-2"/>Crear carpeta
			</Boton>
		</Encabezado>
		<Cuerpo>
			<Input valor={titulo} autoFocus placeholder="Título" cuandoCambie={cuandoCambie} hayError={errorTitulo.length > 0} mensajeError={errorTitulo}/>
		</Cuerpo>
	</>;
};

export default NuevaCarpeta;
