import { api } from "@/api/api";
import { CriterioDeOrdenEnum } from "@/api/clients";
import useApiMutation from "@/api/custom-hooks/use-api-mutation";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { ChevronLeftIcon, PlusIcon } from "@heroicons/react/24/solid";
import ChequearSiRequierePassword from "../../components/requiere-password";
import { Boton, BotonIcono } from "../../components/ui/botones";
import Cuerpo from "../../components/ui/cuerpo";
import Encabezado from "../../components/ui/encabezado";
import SelectorCriterioOrden from "../../components/ui/selector-criterio-orden";
import usarNavegacion from "../../usar-navegacion";
import ListaDeEscritos from "../escritos/lista";

const VerCarpeta = () => {
	const { irAlInicio, irANuevoEscrito, carpetaId } = usarNavegacion();

	const { data, isLoading, isError, refetch } = useApiQuery({
		key: ["carpeta" + carpetaId],
		fn: async () => await api.carpetaGET(Number(carpetaId)),
	});

	const eliminacion = useApiMutation({
		fn: async () => await api.carpetaDELETE(Number(carpetaId)),
		antesDeMensajeExito: () => irAlInicio(),
		mensajeDeExito: `Carpeta '${data?.titulo}' eliminada`,
	});

	const actualizarCriterio = useApiMutation({
		fn: async (criterio: CriterioDeOrdenEnum) =>
			await api.criterioOrden(Number(carpetaId), criterio),
		despuesDeExito: () => refetch(),
		mensajeDeExito: "Criterio de orden actualizado",
	});

	const handleCriterioChange = (nuevoCriterio: CriterioDeOrdenEnum) => {
		actualizarCriterio.mutate(nuevoCriterio);
	};

	return (
		<ChequearSiRequierePassword>
			<Encabezado>
				<Boton soloBorde className='flex justify-between items-center' onClick={irAlInicio}>
					<ChevronLeftIcon className='w-4 h-4 mr-2' />/{data?.titulo}
				</Boton>
				<div className='flex items-center gap-2'>
					<BotonIcono onClick={() => irANuevoEscrito(data?.titulo || "")}>
						<PlusIcon className='h-8 w-8' />
					</BotonIcono>
				</div>
			</Encabezado>
			<div className='flex items-center gap-2'>
				{data?.cantidadDeEscritos && data?.cantidadDeEscritos > 0 && (
					<SelectorCriterioOrden
						valor={data.criterioDeOrden || CriterioDeOrdenEnum._1}
						onChange={handleCriterioChange}
						disabled={actualizarCriterio.isPending}
					/>
				)}
			</div>
			<Cuerpo>
				{data?.cantidadDeEscritos && data?.cantidadDeEscritos > 0 ? (
					<>
						<ListaDeEscritos data={data?.escritos || []} isLoading={isLoading} isError={isError} />
					</>
				) : (
					<div className='flex flex-col justify-center items-center h-full g-2'>
						<div className='text-sm text-gray-500'>No hay escritos en esta carpeta.</div>
						<Boton
							soloBorde
							className='flex justify-between items-center mt-4'
							onClick={() => eliminacion.mutate(Number(carpetaId))}
						>
							¿Eliminar carpeta?
						</Boton>
					</div>
				)}
			</Cuerpo>
		</ChequearSiRequierePassword>
	);
};

export default VerCarpeta;
