import { pedirSync } from "@/sync/pedir-sync";
import { useEstadoSync } from "@/sync/estado-sync";
import { EstadoGuardado } from "@/sync/tipos";
import { toast } from "sonner";

const textoGlobal: Record<EstadoGuardado, string> = {
	guardado: "Sincronizado ✓",
	guardando: "Pendiente de subir",
	pendiente: "Pendiente de subir",
	"sin-conexion": "Sin conexión",
	error: "Error al sincronizar",
};

const colorTexto = (estado: EstadoGuardado, online: boolean): string => {
	if (estado === "error") return "text-red-500 hover:text-red-600";
	if (!online || estado === "sin-conexion") return "text-amber-600 hover:text-amber-700";
	if (estado === "guardando" || estado === "pendiente") return "text-amber-600 hover:text-amber-700";
	return "text-gray-500 hover:text-gray-600";
};

/** Indicador de sync alineado al contenido. Tap fuerza pull/push. */
const IndicadorSync = () => {
	const online = useEstadoSync((s) => s.online);
	const pendientes = useEstadoSync((s) => s.pendientes);
	const estado = useEstadoSync((s) => s.estado);
	const sincronizando = useEstadoSync((s) => s.sincronizando);

	const etiqueta = sincronizando ? "Sincronizando…" : textoGlobal[estado];
	const claseTexto = sincronizando ? "text-gray-500 hover:text-gray-600" : colorTexto(estado, online);

	const alClickear = () => {
		if (!online) {
			toast.error("Sin conexión — no se puede sincronizar ahora");
			return;
		}
		pedirSync();
	};

	return (
		<div className='flex justify-end w-full pt-3 pb-0'>
			<button
				type='button'
				onClick={alClickear}
				disabled={sincronizando}
				aria-label={`Estado de sincronización: ${etiqueta}. Tocá para sincronizar.`}
				className={`flex items-center gap-1.5 text-xs disabled:opacity-80 ${claseTexto}`}
			>
				<span>{etiqueta}</span>
				{pendientes > 0 && (
					<span className='min-w-[1.125rem] rounded-full bg-amber-100 text-amber-800 px-1 text-[10px] font-medium leading-4 text-center'>
						{pendientes > 99 ? "99+" : pendientes}
					</span>
				)}
			</button>
		</div>
	);
};

export default IndicadorSync;
