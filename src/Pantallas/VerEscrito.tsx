import { api } from "@/api/api";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { ChevronLeftIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Boton } from "../components/botones";
import Cuerpo from "../components/cuerpo";
import Encabezado from "../components/encabezado";
import Input from "../components/input";
import ChequearSiRequierePassword from "../components/requierePassword";
import Textarea from "../components/textarea";
import { editarEscrito, eliminarEscrito } from "../firebase";
import usarNavegacion from "../usarNavegacion";

const VerEscrito = () => {
	const { volverAEscritosHome, carpetaId, escritoId } = usarNavegacion();

	const { data, isLoading, isError } = useApiQuery({
		key: ["escrito" + escritoId],
		fn: async () => await api.notaGET(Number(escritoId)),
	});

	const [titulo, setTitulo] = useState("");
	const [cuerpo, setCuerpo] = useState("");

	const editarYVolver = () => {
		if (carpetaId && escritoId && titulo != "")
			editarEscrito(carpetaId, { id: escritoId, titulo, cuerpo, fechaHora: "" });
		volverAEscritosHome();
	};

	const eliminar = () => {
		if (carpetaId && escritoId) eliminarEscrito(carpetaId, escritoId);
		volverAEscritosHome();
	};

	if (isLoading) return <div>Cargando...</div>;
	if (isError) return <div>Error al cargar el escrito</div>;
	if (!data) return <div>No se encontró el escrito</div>;

	return (
		<ChequearSiRequierePassword>
			<Encabezado>
				<Boton soloBorde className='flex justify-between items-center' onClick={editarYVolver}>
					<ChevronLeftIcon className='w-4 h-4 mr-2' />
					{carpetaId}/{escritoId}
				</Boton>
				<Boton soloBorde className='border-none text-slate-400' onClick={eliminar}>
					<TrashIcon className='h-5 w-5' />
				</Boton>
			</Encabezado>
			<Cuerpo>
				<Input
					valor={data.titulo}
					sinBorde
					autoFocus
					placeholder='Título'
					textoReGrande
					cuandoCambie={(e: React.ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value)}
					// hayError={errorTitulo.length > 0}
					// mensajeError={errorTitulo}
				/>
				<div className='pt-2'>
					<Textarea
						valor={data.cuerpo || ""}
						sinBorde
						placeholder='Texto'
						cuandoCambie={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCuerpo(e.target.value)}
						// hayError={errorTitulo.length > 0}
						// mensajeError={errorTitulo}
					/>
				</div>
			</Cuerpo>
		</ChequearSiRequierePassword>
	);
};

export default VerEscrito;
