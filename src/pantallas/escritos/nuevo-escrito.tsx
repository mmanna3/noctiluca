import { usarCarpeta } from "@/sync/lecturas";
import { crearEscritoLocal } from "@/sync/repositorio-escritos";
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
	const { volverAEscritosHome, carpetaId } = usarNavegacion();
	const [titulo, setTitulo] = useState("");
	const [cuerpo, setCuerpo] = useState("");
	const [errorTitulo, setErrorTitulo] = useState("");
	const [creando, setCreando] = useState(false);

	const carpeta = usarCarpeta(carpetaId);

	const crearYVolver = async () => {
		if (!carpetaId || creando) return;
		setCreando(true);
		await crearEscritoLocal({
			titulo: titulo.trim() || "",
			cuerpo,
			carpetaId: Number(carpetaId),
			carpetaClientId: carpeta?.clientId,
		});
		volverAEscritosHome(carpetaId);
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
					disabled={creando || !carpetaId}
				>
					{creando ? (
						<LoadingSpinner className='w-4 h-4 mr-2' />
					) : (
						<ChevronLeftIcon className='w-4 h-4 mr-2' />
					)}
					Crear en /{carpeta?.titulo ?? "…"}
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
