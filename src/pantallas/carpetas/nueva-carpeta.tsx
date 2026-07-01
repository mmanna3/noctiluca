import { crearCarpetaLocal } from "@/sync/repositorio-carpetas";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { toast } from "sonner";
import { Boton } from "../../components/ui/botones";
import Cuerpo from "../../components/ui/cuerpo";
import Encabezado from "../../components/ui/encabezado";
import Input from "../../components/ui/input";
import usarNavegacion from "../../usar-navegacion";

const NuevaCarpeta = () => {
	const { irAlInicio, irACarpeta, carpetaId } = usarNavegacion();
	const [titulo, setTitulo] = useState("");
	const [errorTitulo, setErrorTitulo] = useState("");
	const [creando, setCreando] = useState(false);

	// Si hay carpetaId en la URL, estamos creando una subcarpeta
	const carpetaPadreId = carpetaId ? Number(carpetaId) : undefined;
	const esSubcarpeta = carpetaPadreId !== undefined;

	const volverAlOrigen = () => {
		if (esSubcarpeta && carpetaPadreId !== undefined) irACarpeta(carpetaPadreId);
		else irAlInicio();
	};

	const crearYVolver = async () => {
		if (titulo === "" || creando) {
			if (titulo === "") volverAlOrigen();
			return;
		}

		setCreando(true);
		await crearCarpetaLocal({ titulo, carpetaPadreId });
		toast.success(esSubcarpeta ? `Subcarpeta '${titulo}' creada` : `Carpeta '${titulo}' creada`);
		volverAlOrigen();
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
