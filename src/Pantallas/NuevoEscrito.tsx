import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Boton } from "../components/botones";
import Cuerpo from "../components/cuerpo";
import Encabezado from "../components/encabezado";
import Input from "../components/input";
import Textarea from "../components/textarea";
import { crearEscrito } from "../firebase";
import usarNavegacion from "../usarNavegacion";

const NuevoEscrito = () => {

	const {volverAEscritosHome, carpetaId } = usarNavegacion();
	const [titulo, setTitulo] = useState("");
	const [cuerpo, setCuerpo] = useState("");
	const [errorTitulo, setErrorTitulo] = useState("");

	const crearYVolver = async () => {
		if (titulo === "")
			volverAEscritosHome();
		
		if (carpetaId) {
			const error = await crearEscrito(carpetaId, titulo, cuerpo);
			setErrorTitulo(error);
			if (error === "")
				volverAEscritosHome();
		}
	};

	const cuandoCambieElTitulo = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitulo(e.target.value);
		setErrorTitulo("");
	};

	return <>
		<Encabezado>
			<Boton soloBorde className="flex justify-between items-center" onClick={crearYVolver}>
				<ChevronLeftIcon className="w-4 h-4 mr-2" />Crear en /{carpetaId}
			</Boton>
		</Encabezado><Cuerpo>
			<Input 
				valor={titulo}
				sinBorde
				autoFocus 
				placeholder="Título"
				textoReGrande
				cuandoCambie={cuandoCambieElTitulo} 
				hayError={errorTitulo.length > 0} 
				mensajeError={errorTitulo}/>
			<div className="pt-6">
				<Textarea 
					valor={cuerpo}
					sinBorde
					placeholder="Texto"
					cuandoCambie={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCuerpo(e.target.value)} 
					hayError={errorTitulo.length > 0} 
					mensajeError={errorTitulo}/>
			</div>
		</Cuerpo>
	</>;
};

export default NuevoEscrito;
