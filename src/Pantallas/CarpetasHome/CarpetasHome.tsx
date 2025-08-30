import { api } from "@/api/api";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { LoadingSpinner } from "@/components/loading-spinner";
import { BookOpenIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Boton, BotonIcono } from "../../components/botones";
import Cuerpo from "../../components/cuerpo";
import Encabezado from "../../components/encabezado";
import { useAuth } from "../../hooks/use-auth";
import usarNavegacion from "../../usarNavegacion";
import ListaDeCarpetas from "./ListaDeCarpetas";
import frasesInicio from "./frases-inicio";

const CarpetasHome = () => {
	const { irANuevaCarpeta, irALogin, irAPapelera, irAModoLectura } = usarNavegacion();

	const { logout } = useAuth();

	const obtenerFraseAleatoria = () => {
		const indiceAleatorio = Math.floor(Math.random() * frasesInicio.length);
		return frasesInicio[indiceAleatorio];
	};

	const { data, isLoading, isError } = useApiQuery({
		key: ["carpetas"],
		fn: async () => await api.carpetaAll(),
	});

	const cerrarSesion = () => {
		logout();
		irALogin();
	};

	if (isLoading) {
		return (
			<div className='flex flex-col justify-center items-center h-full gap-2'>
				<LoadingSpinner />
				<div className='mt-6 text-sm text-gray-500'>{obtenerFraseAleatoria()}</div>
			</div>
		);
	}

	return (
		<>
			<Encabezado>
				<Boton soloBorde>/</Boton>
				<BotonIcono onClick={irANuevaCarpeta}>
					<PlusIcon className='h-8 w-8' />
				</BotonIcono>
			</Encabezado>
			<Cuerpo>
				<ListaDeCarpetas data={data || []} isLoading={isLoading} isError={isError} />
			</Cuerpo>
			<div className='flex justify-between w-full'>
				<Boton soloBorde className='w-44 flex justify-around items-center' onClick={cerrarSesion}>
					<XMarkIcon className='w-6' />
					Cerrar sesión
				</Boton>
				<div className='flex justify-around items-center gap-1'>
					<Boton
						soloBorde
						className='w-20 flex justify-around items-center'
						onClick={irAModoLectura}
					>
						<BookOpenIcon className='w-5 h-5' />
					</Boton>
					<Boton soloBorde className='w-20 flex justify-around items-center' onClick={irAPapelera}>
						<TrashIcon className='w-5 h-5' />
					</Boton>
				</div>
			</div>
		</>
	);
};

export default CarpetasHome;
