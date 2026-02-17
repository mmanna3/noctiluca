import { api } from "@/api/api";
import { CriterioDeOrdenEnum } from "@/api/clients";
import useApiMutation from "@/api/custom-hooks/use-api-mutation";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import {
	AdjustmentsHorizontalIcon,
	ChevronLeftIcon,
	PaperAirplaneIcon,
	PlusIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import ChequearSiRequierePassword from "../../components/requiere-password";
import { Boton, BotonIcono } from "../../components/ui/botones";
import Cuerpo from "../../components/ui/cuerpo";
import Encabezado from "../../components/ui/encabezado";
import ModalSeleccionarCarpeta from "../../components/ui/modal-seleccionar-carpeta";
import SelectorCriterioOrden from "../../components/ui/selector-criterio-orden";
import usarNavegacion from "../../usar-navegacion";
import ListaDeEscritos from "../escritos/lista";

const VerCarpeta = () => {
	const { irAlInicio, irANuevoEscrito, carpetaId } = usarNavegacion();
	const [mostrarHerramientas, setMostrarHerramientas] = useState(false);
	const [modoSeleccion, setModoSeleccion] = useState(false);
	const [escritosSeleccionados, setEscritosSeleccionados] = useState<Set<number>>(new Set());
	const [mostrarModalMover, setMostrarModalMover] = useState(false);

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

	const handleLongPress = (escritoId: number) => {
		setModoSeleccion(true);
		setEscritosSeleccionados(new Set([escritoId]));
	};

	const handleToggleSeleccion = (escritoId: number) => {
		setEscritosSeleccionados((prev) => {
			const nuevo = new Set(prev);
			if (nuevo.has(escritoId)) {
				nuevo.delete(escritoId);
			} else {
				nuevo.add(escritoId);
			}
			return nuevo;
		});
	};

	const seleccionarTodos = () => {
		const todosLosIds = (data?.escritos || [])
			.filter((e) => e.id !== undefined)
			.map((e) => e.id as number);
		setEscritosSeleccionados(new Set(todosLosIds));
	};

	const cancelarSeleccion = () => {
		setModoSeleccion(false);
		setEscritosSeleccionados(new Set());
	};

	return (
		<ChequearSiRequierePassword>
			{modoSeleccion ? (
				<Encabezado>
					<div className='flex items-center gap-2'>
						<span className='text-sm font-medium'>
							{escritosSeleccionados.size} seleccionado
							{escritosSeleccionados.size !== 1 ? "s" : ""}
						</span>
						<Boton className='hover:bg-yellow-200' sinBorde chiquito onClick={seleccionarTodos}>
							Todos
						</Boton>
					</div>
					<div className='flex items-center gap-1'>
						<Boton
							sinBorde
							className='text-slate-600 hover:bg-yellow-200'
							onClick={() => setMostrarModalMover(true)}
							disabled={escritosSeleccionados.size === 0}
						>
							<PaperAirplaneIcon className='h-5 w-5' />
						</Boton>
						<Boton
							sinBorde
							className='text-slate-400 hover:bg-yellow-200'
							onClick={cancelarSeleccion}
						>
							<XMarkIcon className='h-5 w-5' />
						</Boton>
					</div>
				</Encabezado>
			) : (
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
			)}
			{!modoSeleccion && (
				<div className='flex items-center gap-2 mt-1 ml-[-12px]'>
					<Boton sinBorde onClick={() => setMostrarHerramientas(!mostrarHerramientas)}>
						<AdjustmentsHorizontalIcon className='h-4 w-4' />
					</Boton>
					{mostrarHerramientas && (
						<div className='flex items-center gap-2'>
							{data?.cantidadDeEscritos && data?.cantidadDeEscritos > 0 && (
								<SelectorCriterioOrden
									valor={data.criterioDeOrden || CriterioDeOrdenEnum._1}
									onChange={handleCriterioChange}
									disabled={actualizarCriterio.isPending}
								/>
							)}
						</div>
					)}
				</div>
			)}
			<Cuerpo>
				{data?.cantidadDeEscritos && data?.cantidadDeEscritos > 0 ? (
					<ListaDeEscritos
						data={data?.escritos || []}
						isLoading={isLoading}
						isError={isError}
						modoSeleccion={modoSeleccion}
						escritosSeleccionados={escritosSeleccionados}
						onToggleSeleccion={handleToggleSeleccion}
						onLongPress={handleLongPress}
					/>
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
			{mostrarModalMover && carpetaId && (
				<ModalSeleccionarCarpeta
					escritoIds={Array.from(escritosSeleccionados)}
					carpetaActualId={Number(carpetaId)}
					onCerrar={() => setMostrarModalMover(false)}
					onMovido={() => {
						setMostrarModalMover(false);
						cancelarSeleccion();
						refetch();
					}}
				/>
			)}
		</ChequearSiRequierePassword>
	);
};

export default VerCarpeta;
