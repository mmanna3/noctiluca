import { api } from "@/api/api";
import { EscritoDTO } from "@/api/clients";
import useApiMutation from "@/api/custom-hooks/use-api-mutation";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Boton } from "../components/botones";
import Cuerpo from "../components/cuerpo";
import Encabezado from "../components/encabezado";
import Input from "../components/input";
import Textarea from "../components/textarea";
import usarNavegacion from "../usar-navegacion";

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
		mensajeDeExito: `Escrito '${titulo}' creado`,
	});

	const crearYVolver = async () => {
		if (titulo === "") volverAEscritosHome();

		if (carpetaId) {
			creacion.mutate(
				new EscritoDTO({
					titulo,
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
				<Boton soloBorde className='flex justify-between items-center' onClick={crearYVolver}>
					<ChevronLeftIcon className='w-4 h-4 mr-2' />
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
