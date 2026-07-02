import { api } from "@/api/api";
import { useEstadoSync } from "@/sync/estado-sync";
import { usarEscrito } from "@/sync/lecturas";
import { pedirSync } from "@/sync/pedir-sync";
import {
	cambiarPapeleraLocal,
	eliminarEscritoLocal,
	sembrarEscrito,
} from "@/sync/repositorio-escritos";
import { bloquearSiOffline } from "@/utils/requiere-online";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import ChequearSiRequierePassword from "../../components/requiere-password";
import Cuerpo from "../../components/ui/cuerpo";
import ModalSeleccionarCarpeta from "../../components/ui/modal-seleccionar-carpeta";
import usarNavegacion from "../../usar-navegacion";
import CuerpoEscrito from "./cuerpo-escrito";
import EncabezadoEscrito from "./encabezado-escrito";
import { usarAutoguardado } from "./usar-autoguardado";

const VerEscrito = () => {
	const { volverAEscritosHome, volverAPapelera, escritoId, carpetaId } = usarNavegacion();
	const location = useLocation();
	const vieneDePapelera = location.pathname.includes("/papelera");

	const [mostrarModalMover, setMostrarModalMover] = useState(false);
	const estadoGuardado = useEstadoSync((s) => s.estado);

	const data = usarEscrito(escritoId);
	const [eliminando, setEliminando] = useState(false);

	const [titulo, setTitulo] = useState("");
	const [cuerpo, setCuerpo] = useState("");
	const [inicializado, setInicializado] = useState<string | null>(null);
	const [seedIntentado, setSeedIntentado] = useState(false);
	const [seedFinalizado, setSeedFinalizado] = useState(false);

	// Inicializa el editor una única vez por escrito. Las actualizaciones
	// posteriores de Dexie (por el propio autoguardado) no pisan lo que se tipea.
	useEffect(() => {
		if (data && data.clientId && inicializado !== data.clientId) {
			setTitulo(data.titulo ?? "");
			setCuerpo(data.cuerpo ?? "");
			setInicializado(data.clientId);
		}
	}, [data, inicializado]);

	// Si el escrito aún no está en local (acceso directo por URL antes del pull),
	// se trae por API y se siembra en Dexie.
	useEffect(() => {
		if (data !== null || seedIntentado) return;
		if (!escritoId || !/^\d+$/.test(escritoId)) return;
		if (typeof navigator !== "undefined" && !navigator.onLine) return;
		setSeedIntentado(true);
		api.escritoGET(Number(escritoId))
			.then((e) => {
				if (e?.clientId) {
					void sembrarEscrito({
						clientId: e.clientId,
						serverId: e.id,
						titulo: e.titulo ?? "",
						cuerpo: e.cuerpo ?? "",
						carpetaClientId: e.carpetaClientId,
						carpetaId: e.carpetaId,
						version: e.version ?? 0,
						fechaHoraCreacion: e.fechaHoraCreacion?.toISOString?.(),
						fechaHoraEdicion: e.fechaHoraEdicion?.toISOString?.(),
						estaEnPapelera: e.estaEnPapelera ?? false,
					});
				}
			})
			.catch(() => undefined)
			.finally(() => setSeedFinalizado(true));
	}, [data, escritoId, seedIntentado]);

	const { flush } = usarAutoguardado(data ?? undefined, titulo, cuerpo);

	// El botón "atrás" ya no persiste: solo asegura el guardado (flush) y navega.
	const volver = () => {
		void flush();
		if (vieneDePapelera) volverAPapelera();
		else volverAEscritosHome();
	};

	const eliminarYVolver = async () => {
		if (!data?.clientId || eliminando) return;
		setEliminando(true);
		const nombre = data.titulo;
		if (vieneDePapelera) await eliminarEscritoLocal(data.clientId);
		else await cambiarPapeleraLocal(data.clientId, true);
		toast.success(`Escrito '${nombre}' ${vieneDePapelera ? "eliminado" : "al tacho"}`);
		if (vieneDePapelera) volverAPapelera();
		else volverAEscritosHome();
	};

	if (data === undefined) return <div>Cargando...</div>;
	if (data === null) {
		const puedeSembrar =
			!!escritoId &&
			/^\d+$/.test(escritoId) &&
			(typeof navigator === "undefined" || navigator.onLine);
		if (puedeSembrar && !seedFinalizado) return <div>Cargando...</div>;
		return <div>No se encontró el escrito</div>;
	}

	return (
		<ChequearSiRequierePassword>
			<EncabezadoEscrito
				titulo={titulo}
				carpetaTitulo={data.carpetaTitulo || ""}
				vieneDePapelera={vieneDePapelera}
				estadoGuardado={estadoGuardado}
				eliminando={eliminando}
				onVolver={volver}
				onMover={() => {
					if (
						bloquearSiOffline("No podés mover escritos sin conexión a internet.")
					) {
						return;
					}
					setMostrarModalMover(true);
				}}
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
			{mostrarModalMover && data.id && carpetaId && (
				<ModalSeleccionarCarpeta
					escritoIds={[data.id]}
					carpetaActualId={Number(carpetaId)}
					onCerrar={() => setMostrarModalMover(false)}
					onMovido={() => {
						setMostrarModalMover(false);
						pedirSync();
						volverAEscritosHome();
					}}
				/>
			)}
		</ChequearSiRequierePassword>
	);
};

export default VerEscrito;
