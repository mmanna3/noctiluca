import { api } from "@/api/api";
import { NotaDTO } from "@/api/clients";
import useApiMutation from "@/api/custom-hooks/use-api-mutation";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Boton } from "../components/botones";
import Cuerpo from "../components/cuerpo";
import Encabezado from "../components/encabezado";
import Input from "../components/input";
import ChequearSiRequierePassword from "../components/requierePassword";
import Textarea from "../components/textarea";
import usarNavegacion from "../usarNavegacion";

const VerEscrito = () => {
	const { volverAEscritosHome, escritoId } = usarNavegacion();

	const { data, isLoading, isError } = useApiQuery({
		key: ["escrito" + escritoId],
		fn: async () => await api.notaGET(Number(escritoId)),
	});

	const mutation = useApiMutation({
		fn: async (notaActualizada: NotaDTO) => {
			if (!escritoId) return;
			await api.notaPUT(Number(escritoId), notaActualizada);
		},
		antesDeMensajeExito: () => volverAEscritosHome(),
		mensajeDeExito: `Escrito '${data?.titulo}' actualizado correctamente`,
	});

	const [titulo, setTitulo] = useState(data?.titulo || "");
	const [cuerpo, setCuerpo] = useState(data?.cuerpo || "");

	const editarYVolver = () => {
		if (escritoId && titulo != "")
			mutation.mutate(
				new NotaDTO({
					id: Number(escritoId),
					titulo,
					cuerpo,
				}),
			);
		volverAEscritosHome();
	};

	// const eliminar = () => {
	// 	if (carpetaId && escritoId) eliminarEscrito(carpetaId, escritoId);
	// 	volverAEscritosHome();
	// };

	if (isLoading) return <div>Cargando...</div>;
	if (isError) return <div>Error al cargar el escrito</div>;
	if (!data) return <div>No se encontró el escrito</div>;

	return (
		<ChequearSiRequierePassword>
			<Encabezado>
				<Boton soloBorde className='flex justify-between items-center' onClick={editarYVolver}>
					<ChevronLeftIcon className='w-4 h-4 mr-2' />
					{data.carpetaId}/{escritoId}
					{/* {data.carpetaTitulo}/{escritoId} */}
				</Boton>
				{/* <Boton soloBorde className='border-none text-slate-400' onClick={eliminar}>
					<TrashIcon className='h-5 w-5' />
				</Boton> */}
			</Encabezado>
			<Cuerpo>
				<Input
					valor={titulo}
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
						valor={cuerpo}
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
