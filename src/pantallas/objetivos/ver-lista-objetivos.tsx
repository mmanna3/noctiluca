import { api } from "@/api/api";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { queryKeys } from "@/api/query-keys";
import { Boton } from "@/components/ui/botones";
import Cuerpo from "@/components/ui/cuerpo";
import Encabezado from "@/components/ui/encabezado";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import ChequearSiRequierePassword from "../../components/requiere-password";
import usarNavegacion from "../../usar-navegacion";
import EditorListaObjetivos from "./editor-lista-objetivos";
import { etiquetaPeriodo } from "./utilidades-objetivos";

const VerListaObjetivos = () => {
	const { listaId, carpetaId, volverAEscritosHome } = usarNavegacion();

	const { data } = useApiQuery({
		key: queryKeys.objetivosLista(listaId),
		fn: () => api.lista2(Number(listaId)),
	});

	const titulo =
		data?.tipo && data.clavePeriodo
			? etiquetaPeriodo(data.tipo, data.clavePeriodo, data.fechaInicio, data.fechaFin)
			: "Lista de objetivos";

	return (
		<ChequearSiRequierePassword>
			<Encabezado>
				<Boton soloBorde className='flex justify-between items-center' onClick={() => volverAEscritosHome(carpetaId)}>
					<ChevronLeftIcon className='w-4 h-4 mr-2' />/{titulo}
				</Boton>
			</Encabezado>
			<Cuerpo>
				<EditorListaObjetivos listaId={Number(listaId)} titulo={titulo} />
			</Cuerpo>
		</ChequearSiRequierePassword>
	);
};

export default VerListaObjetivos;
