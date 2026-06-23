import { api } from "@/api/api";
import { CarpetaDTO } from "@/api/clients";
import useApiMutation from "@/api/custom-hooks/use-api-mutation";
import { clavesCarpetas } from "@/api/query-keys";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Boton } from "../../components/ui/botones";
import Cuerpo from "../../components/ui/cuerpo";
import Encabezado from "../../components/ui/encabezado";
import Input from "../../components/ui/input";
import usarNavegacion from "../../usar-navegacion";

const NuevaCarpeta = () => {
	const { irAlInicio, irACarpeta, carpetaId } = usarNavegacion();
	const [titulo, setTitulo] = useState("");
	const [errorTitulo, setErrorTitulo] = useState("");

	// Si hay carpetaId en la URL, estamos creando una subcarpeta
	const carpetaPadreId = carpetaId ? Number(carpetaId) : undefined;
	const esSubcarpeta = carpetaPadreId !== undefined;

	const volverAlOrigen = () => {
		if (esSubcarpeta && carpetaPadreId !== undefined) irACarpeta(carpetaPadreId);
		else irAlInicio();
	};

	const creacion = useApiMutation({
		fn: async (carpeta: CarpetaDTO) => {
			await api.carpetaPOST(carpeta);
		},
		antesDeMensajeExito: volverAlOrigen,
		mensajeDeExito: esSubcarpeta ? `Subcarpeta '${titulo}' creada` : `Carpeta '${titulo}' creada`,
		invalidarQueries: clavesCarpetas,
	});

	const crearYVolver = async () => {
		if (titulo === "") {
			volverAlOrigen();
			return;
		}

		creacion.mutate(
			new CarpetaDTO({
				titulo,
				carpetaPadreId,
			}),
		);
	};

	const cuandoCambie = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitulo(e.target.value);
		setErrorTitulo("");
	};

	return (
		<>
			<Encabezado>
				<Boton soloBorde className='flex justify-between items-center' onClick={crearYVolver}>
					<ChevronLeftIcon className='w-4 h-4 mr-2' />
					{esSubcarpeta ? "Crear subcarpeta" : "Crear carpeta"}
				</Boton>
			</Encabezado>
			<Cuerpo>
				<Input
					valor={titulo}
					autoFocus
					placeholder='Título'
					cuandoCambie={cuandoCambie}
					hayError={errorTitulo.length > 0}
					mensajeError={errorTitulo}
				/>
			</Cuerpo>
		</>
	);
};

export default NuevaCarpeta;
