import { api } from "@/api/api";
import { CriterioDeOrdenEnum } from "@/api/clients";
import useApiMutation from "@/api/custom-hooks/use-api-mutation";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { useState } from "react";
import ChequearSiRequierePassword from "../../components/requiere-password";
import Cuerpo from "../../components/ui/cuerpo";
import ModalSeleccionarCarpeta from "../../components/ui/modal-seleccionar-carpeta";
import usarNavegacion from "../../usar-navegacion";
import ListaDeEscritos from "../escritos/lista";
import BarraDeHerramientas from "./barra-de-herramientas";
import EncabezadoNormal from "./encabezado-normal";
import EncabezadoSeleccion from "./encabezado-seleccion";
import EstadoVacio from "./estado-vacio";

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
					onVolver={irAlInicio}
					onNuevoEscrito={() => irANuevoEscrito(data?.titulo || "")}
				/>
			)}
			{!modoSeleccion && (
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
				{tieneEscritos ? (
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
					<EstadoVacio onEliminar={() => eliminacion.mutate(Number(carpetaId))} />
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
