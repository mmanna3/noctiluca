import { ChevronLeftIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { IEscrito } from "../Interfaces";
import { Boton } from "../components/botones";
import Cuerpo from "../components/cuerpo";
import Encabezado from "../components/encabezado";
import Input from "../components/input";
import ChequearSiRequierePassword from "../components/requierePassword";
import Textarea from "../components/textarea";
import { editarEscrito, eliminarEscrito, obtenerEscrito } from "../firebase";
import usarNavegacion from "../usarNavegacion";


const VerEscrito = () => {

	const {volverAEscritosHome, carpetaId, escritoId} = usarNavegacion();
	
	const [titulo, setTitulo] = useState("");
	const [cuerpo, setCuerpo] = useState("");

	useEffect(() => {
		const callback = (_escrito: IEscrito) => {
			console.log(_escrito);
			setTitulo(_escrito.titulo);
			setCuerpo(_escrito.cuerpo);
		};

		if (carpetaId && escritoId)
			obtenerEscrito(carpetaId, escritoId, callback);
			
	}, [escritoId]);

	const editarYVolver = () => {
		if (carpetaId && escritoId && titulo != "")
			editarEscrito(carpetaId, {id: escritoId, titulo, cuerpo, fechaHora: ""});
		volverAEscritosHome();
	};

	const eliminar = () => {
		if (carpetaId && escritoId)
			eliminarEscrito(carpetaId, escritoId);
		volverAEscritosHome();
	};

	return <ChequearSiRequierePassword>
		<Encabezado>
			<Boton soloBorde className="flex justify-between items-center" onClick={editarYVolver}>
				<ChevronLeftIcon className="w-4 h-4 mr-2" />{carpetaId}/{escritoId}
			</Boton>
			<Boton soloBorde className="border-none text-slate-500" onClick={eliminar}>
				<TrashIcon className="h-5 w-5" />
			</Boton>
		</Encabezado><Cuerpo>
			<Input 
				valor={titulo}
				sinBorde
				autoFocus 
				placeholder="Título"
				textoReGrande
				cuandoCambie={(e: React.ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value)} 
				// hayError={errorTitulo.length > 0} 
				// mensajeError={errorTitulo}
			/>
			<div className="pt-6">
				<Textarea 
					valor={cuerpo}
					sinBorde
					placeholder="Texto"
					cuandoCambie={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCuerpo(e.target.value)} 
					// hayError={errorTitulo.length > 0} 
					// mensajeError={errorTitulo}
				/>
			</div>
		</Cuerpo>
	</ChequearSiRequierePassword>;
};

export default VerEscrito;