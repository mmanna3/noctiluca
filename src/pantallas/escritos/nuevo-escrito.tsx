import { api } from "@/api/api";
import { EscritoDTO } from "@/api/clients";
import useApiMutation from "@/api/custom-hooks/use-api-mutation";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Boton } from "../../components/ui/botones";
import Cuerpo from "../../components/ui/cuerpo";
import Encabezado from "../../components/ui/encabezado";
import Input from "../../components/ui/input";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import Textarea from "../../components/ui/textarea";
import usarNavegacion from "../../usar-navegacion";

const NuevoEscrito = () => {
	const { volverAEscritosHome, carpetaId, carpetaTitulo } = usarNavegacion();
	const [titulo, setTitulo] = useState("");
	const [cuerpo, setCuerpo] = useState("");
	const [errorTitulo, setErrorTitulo] = useState("");

	const creacion = useApiMutation({
		fn: async (escrito: EscritoDTO) => {
			await api.escritoPOST(escrito);
		},
		antesDeMensajeExito: () => volverAEscritosHome(),
		mensajeDeExito: `Escrito ${titulo.trim() ? `'${titulo}'` : "sin título"} creado`,
	});

	const crearYVolver = async () => {
		if (carpetaId) {
			creacion.mutate(
				new EscritoDTO({
					titulo: titulo.trim() || "", // Permitir título vacío
					cuerpo,
					carpetaId: Number(carpetaId),
				}),
			);
		}
	};

	const cuandoCambieElTitulo = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitulo(e.target.value);
		setErrorTitulo("");
	};

	return (
		<>
			<Encabezado>
				<Boton
					soloBorde
					className='flex justify-between items-center'
					onClick={crearYVolver}
					disabled={creacion.isPending}
				>
					{creacion.isPending ? (
						<LoadingSpinner className='w-4 h-4 mr-2' />
					) : (
						<ChevronLeftIcon className='w-4 h-4 mr-2' />
					)}
					Crear en /{carpetaTitulo}
				</Boton>
			</Encabezado>
			<Cuerpo>
				<Input
					valor={titulo}
					sinBorde
					autoFocus
					placeholder='Título'
					textoReGrande
					cuandoCambie={cuandoCambieElTitulo}
					hayError={errorTitulo.length > 0}
					mensajeError={errorTitulo}
				/>
				<div className='pt-4'>
					<Textarea
						valor={cuerpo}
						sinBorde
						placeholder='Texto'
						cuandoCambie={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCuerpo(e.target.value)}
						hayError={errorTitulo.length > 0}
						mensajeError={errorTitulo}
					/>
				</div>
			</Cuerpo>
		</>
	);
};

export default NuevoEscrito;
