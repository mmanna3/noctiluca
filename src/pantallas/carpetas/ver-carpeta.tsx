import { api } from "@/api/api";
import { CarpetaDTO, CriterioDeOrdenEnum } from "@/api/clients";
import useApiMutation from "@/api/custom-hooks/use-api-mutation";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { clavesCarpetas, queryKeys } from "@/api/query-keys";
import { Boton } from "@/components/ui/botones";
import { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import ChequearSiRequierePassword from "../../components/requiere-password";
import Cuerpo from "../../components/ui/cuerpo";
import Encabezado from "../../components/ui/encabezado";
import ModalSeleccionarCarpeta from "../../components/ui/modal-seleccionar-carpeta";
import usarNavegacion from "../../usar-navegacion";
import EditorListaObjetivos from "../objetivos/editor-lista-objetivos";
import HistoricoObjetivos from "../objetivos/historico-objetivos";
import {
	clavePeriodoActual,
	propositoATipo,
	tituloPeriodoActual,
} from "../objetivos/utilidades-objetivos";
import ListaDeEscritos from "../escritos/lista";
import BarraDeHerramientas from "./barra-de-herramientas";
import EncabezadoNormal from "./encabezado-normal";
import EncabezadoSeleccion from "./encabezado-seleccion";
import EstadoVacio from "./estado-vacio";
import ListaDeCarpetas from "./lista";

const VerCarpeta = () => {
	const { irAlInicio, irACarpeta, irANuevoEscrito, irANuevaSubcarpeta, carpetaId } =
		usarNavegacion();
	const [mostrarHerramientas, setMostrarHerramientas] = useState(false);
	const [modoSeleccion, setModoSeleccion] = useState(false);
	const [escritosSeleccionados, setEscritosSeleccionados] = useState<Set<number>>(new Set());
	const [mostrarModalMover, setMostrarModalMover] = useState(false);

	const { data, isLoading, isError } = useApiQuery({
		key: queryKeys.carpeta(carpetaId),
		fn: async () => await api.carpetaGET(Number(carpetaId)),
	});

	const esSubcarpeta = data?.carpetaPadreId !== undefined && data?.carpetaPadreId !== null;
	const tieneSubcarpetas = !!(data?.cantidadDeSubCarpetas && data.cantidadDeSubCarpetas > 0);
	const esCarpetaSistema = data?.esSistema === true;
	const tipoObjetivo = propositoATipo(data?.propositoCarpeta);
	const esVistaObjetivos = tipoObjetivo !== undefined;

	const volver = () => {
		if (esSubcarpeta && data?.carpetaPadreId) irACarpeta(data.carpetaPadreId);
		else irAlInicio();
	};

	const eliminacion = useApiMutation({
		fn: async () => await api.carpetaDELETE(Number(carpetaId)),
		antesDeMensajeExito: volver,
		mensajeDeExito: `Carpeta '${data?.titulo}' eliminada`,
		invalidarQueries: clavesCarpetas,
	});

	const actualizarCriterio = useApiMutation({
		fn: async (criterio: CriterioDeOrdenEnum) =>
			await api.criterioOrden(Number(carpetaId), criterio),
		mensajeDeExito: "Criterio de orden actualizado",
		invalidarQueries: [queryKeys.carpeta(carpetaId)],
	});

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

	const tieneEscritos = !!(data?.cantidadDeEscritos && data.cantidadDeEscritos > 0);
	const estaVacia = !tieneEscritos && !tieneSubcarpetas && !esVistaObjetivos;

	if (esVistaObjetivos && tipoObjetivo && carpetaId) {
		const claveActual = clavePeriodoActual(tipoObjetivo);
		return (
			<ChequearSiRequierePassword>
				<Encabezado>
					<Boton soloBorde className='flex justify-between items-center' onClick={volver}>
						<ChevronLeftIcon className='w-4 h-4 mr-2' />/{data?.titulo ?? "objetivos"}
					</Boton>
				</Encabezado>
				<Cuerpo>
					<EditorListaObjetivos
						tipo={tipoObjetivo}
						clavePeriodo={claveActual}
						titulo={tituloPeriodoActual(tipoObjetivo)}
					/>
					<h3 className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 mt-2'>
						Histórico
					</h3>
					<HistoricoObjetivos tipo={tipoObjetivo} carpetaId={Number(carpetaId)} />
				</Cuerpo>
			</ChequearSiRequierePassword>
		);
	}

	return (
		<ChequearSiRequierePassword>
			{modoSeleccion ? (
				<EncabezadoSeleccion
					cantidadSeleccionados={escritosSeleccionados.size}
					onSeleccionarTodos={seleccionarTodos}
					onMover={() => setMostrarModalMover(true)}
					onCancelar={cancelarSeleccion}
					puedeMover={escritosSeleccionados.size > 0}
				/>
			) : (
				<EncabezadoNormal
					titulo={data?.titulo || ""}
					onVolver={volver}
					onNuevoEscrito={() => irANuevoEscrito(data?.id ?? carpetaId)}
					onNuevaSubcarpeta={
						esSubcarpeta || esCarpetaSistema ? undefined : irANuevaSubcarpeta
					}
				/>
			)}
			{!modoSeleccion && !esCarpetaSistema && (
				<BarraDeHerramientas
					mostrar={mostrarHerramientas}
					onToggle={() => setMostrarHerramientas(!mostrarHerramientas)}
					criterioActual={data?.criterioDeOrden || CriterioDeOrdenEnum._1}
					tieneEscritos={tieneEscritos}
					actualizandoCriterio={actualizarCriterio.isPending}
					onCambiarCriterio={(criterio) => actualizarCriterio.mutate(criterio)}
				/>
			)}
			<Cuerpo>
				{estaVacia ? (
					<EstadoVacio
						onEliminar={
							esCarpetaSistema ? undefined : () => eliminacion.mutate(Number(carpetaId))
						}
					/>
				) : (
					<>
						{tieneSubcarpetas && (
							<ListaDeCarpetas
								data={(data?.subCarpetas || []) as CarpetaDTO[]}
								isLoading={isLoading}
								isError={isError}
							/>
						)}
						{tieneEscritos && (
							<ListaDeEscritos
								data={data?.escritos || []}
								isLoading={isLoading}
								isError={isError}
								modoSeleccion={modoSeleccion}
								escritosSeleccionados={escritosSeleccionados}
								onToggleSeleccion={handleToggleSeleccion}
								onLongPress={handleLongPress}
							/>
						)}
					</>
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
					}}
				/>
			)}
		</ChequearSiRequierePassword>
	);
};

export default VerCarpeta;
