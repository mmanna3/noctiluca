import { api } from "@/api/api";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { ChevronLeftIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Boton, BotonIcono } from "../../components/botones";
import Cuerpo from "../../components/cuerpo";
import Encabezado from "../../components/encabezado";
import ChequearSiRequierePassword from "../../components/requierePassword";
import usarNavegacion from "../../usarNavegacion";
import ListaDeEscritos from "./ListaDeEscritos";

const EscritosHome = () => {
	const { irACarpetasHome, irANuevoEscrito, carpetaId } = usarNavegacion();

	const { data, isLoading, isError } = useApiQuery({
		key: ["carpeta" + carpetaId],
		fn: async () => await api.carpetaGET(Number(carpetaId)),
	});

	return (
		<ChequearSiRequierePassword>
			<Encabezado>
				<Boton soloBorde className='flex justify-between items-center' onClick={irACarpetasHome}>
					<ChevronLeftIcon className='w-4 h-4 mr-2' />/{data?.titulo}
				</Boton>
				<BotonIcono onClick={irANuevoEscrito}>
					<PlusIcon className='h-8 w-8' />
				</BotonIcono>
			</Encabezado>
			<Cuerpo>
				<ListaDeEscritos data={data?.notas || []} isLoading={isLoading} isError={isError} />
			</Cuerpo>
		</ChequearSiRequierePassword>
	);
};

export default EscritosHome;
