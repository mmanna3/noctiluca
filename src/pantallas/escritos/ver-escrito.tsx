import { api } from "@/api/api";
import { EscritoDTO } from "@/api/clients";
import useApiMutation from "@/api/custom-hooks/use-api-mutation";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { clavesEscritos, queryKeys } from "@/api/query-keys";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ChequearSiRequierePassword from "../../components/requiere-password";
import Cuerpo from "../../components/ui/cuerpo";
import ModalSeleccionarCarpeta from "../../components/ui/modal-seleccionar-carpeta";
import usarNavegacion from "../../usar-navegacion";
import CuerpoEscrito from "./cuerpo-escrito";
import EncabezadoEscrito from "./encabezado-escrito";

const VerEscrito = () => {
	const { volverAEscritosHome, volverAPapelera, escritoId, carpetaId } = usarNavegacion();
	const location = useLocation();
	const vieneDePapelera = location.pathname.includes("/papelera");

	const [mostrarModalMover, setMostrarModalMover] = useState(false);

	const { data, isLoading, isError } = useApiQuery({
		key: queryKeys.escrito(escritoId),
		fn: async () => await api.escritoGET(Number(escritoId)),
	});

	const edicion = useApiMutation({
		fn: async (escritoActualizado: EscritoDTO) => {
			if (!escritoId) return;
			await api.escritoPUT(Number(escritoId), escritoActualizado);
		},
		antesDeMensajeExito: () => (vieneDePapelera ? volverAPapelera() : volverAEscritosHome()),
		mensajeDeExito: `Escrito '${data?.titulo}' actualizado`,
		invalidarQueries: [
			queryKeys.escrito(escritoId),
			queryKeys.carpeta(carpetaId),
			...clavesEscritos,
			queryKeys.carpetas,
		],
	});

	const eliminacion = useApiMutation({
		fn: async () => {
			if (!escritoId) return;
			if (vieneDePapelera) {
				await api.escritoDELETE(Number(escritoId));
			} else {
				await api.ponerEnPapelera(Number(escritoId));
			}
		},
		antesDeMensajeExito: () => (vieneDePapelera ? volverAPapelera() : volverAEscritosHome()),
		mensajeDeExito: `Escrito '${data?.titulo}' ${vieneDePapelera ? "eliminado" : "al tacho"}`,
		invalidarQueries: [
			queryKeys.escrito(escritoId),
			queryKeys.carpeta(carpetaId),
			...clavesEscritos,
			queryKeys.carpetas,
		],
	});

	const [titulo, setTitulo] = useState("");
	const [cuerpo, setCuerpo] = useState("");

	useEffect(() => {
		if (data) {
			setTitulo(data.titulo ?? "");
			setCuerpo(data.cuerpo ?? "");
		}
	}, [data]);

	const editarYVolver = () => {
		if (escritoId && titulo != "")
			edicion.mutate(
				new EscritoDTO({
					id: Number(escritoId),
					titulo,
					cuerpo,
				}),
			);
	};

	const eliminarYVolver = () => {
		if (escritoId) eliminacion.mutate(Number(escritoId));
	};

	if (isLoading) return <div>Cargando...</div>;
	if (isError) return <div>Error al cargar el escrito</div>;
	if (!data) return <div>No se encontró el escrito</div>;

	return (
		<ChequearSiRequierePassword>
			<EncabezadoEscrito
				titulo={titulo}
				carpetaTitulo={data.carpetaTitulo || ""}
				vieneDePapelera={vieneDePapelera}
				guardando={edicion.isPending}
				eliminando={eliminacion.isPending}
				onVolver={editarYVolver}
				onMover={() => setMostrarModalMover(true)}
				onEliminar={eliminarYVolver}
			/>
			<Cuerpo>
				<CuerpoEscrito
					titulo={titulo}
					cuerpo={cuerpo}
					onCambiarTitulo={(e) => setTitulo(e.target.value)}
					onCambiarCuerpo={(e) => setCuerpo(e.target.value)}
				/>
			</Cuerpo>
			{mostrarModalMover && escritoId && carpetaId && (
				<ModalSeleccionarCarpeta
					escritoIds={[Number(escritoId)]}
					carpetaActualId={Number(carpetaId)}
					onCerrar={() => setMostrarModalMover(false)}
					onMovido={() => {
						setMostrarModalMover(false);
						volverAEscritosHome();
					}}
				/>
			)}
		</ChequearSiRequierePassword>
	);
};

export default VerEscrito;
