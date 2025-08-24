import { api } from "@/api/api";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Boton, BotonIcono } from "../../components/botones";
import Cuerpo from "../../components/cuerpo";
import Encabezado from "../../components/encabezado";
import { useAuth } from "../../hooks/use-auth";
import usarNavegacion from "../../usarNavegacion";
import ListaDeCarpetas from "./ListaDeCarpetas";

const CarpetasHome = () => {
	const { irANuevaCarpeta, irALogin } = usarNavegacion();

	const { logout } = useAuth();

	const { data, isLoading, isError } = useApiQuery({
		key: ["carpetas"],
		fn: async () => await api.carpetaAll(),
	});

	const cerrarSesion = () => {
		logout();
		irALogin();
	};

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
			<Boton soloBorde className='w-44 flex justify-around items-center' onClick={cerrarSesion}>
				<XMarkIcon className='w-6' />
				Cerrar sesión
			</Boton>
		</>
	);
};

export default CarpetasHome;
