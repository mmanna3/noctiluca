import { pedirSync } from "@/sync/pedir-sync";
import { useEstadoSync } from "@/sync/estado-sync";
import { EstadoGuardado } from "@/sync/tipos";
import { toast } from "sonner";

const textoGlobal: Record<EstadoGuardado, string> = {
	guardado: "Sincronizado",
	guardando: "Pendiente de subir",
	pendiente: "Pendiente de subir",
	"sin-conexion": "Sin conexión",
	error: "Error al sincronizar",
};

const colorPunto = (
	sincronizando: boolean,
	online: boolean,
	estado: EstadoGuardado,
	pendientes: number,
): string => {
	if (sincronizando) return "bg-slate-400";
	if (estado === "error") return "bg-red-500";
	if (!online) return "bg-amber-500";
	if (pendientes > 0 || estado === "guardando" || estado === "pendiente") return "bg-amber-500";
	return "bg-emerald-500";
};

/** Indicador fijo de sync: estado + contador. Tap fuerza pull/push. */
const IndicadorSync = () => {
	const online = useEstadoSync((s) => s.online);
	const pendientes = useEstadoSync((s) => s.pendientes);
	const estado = useEstadoSync((s) => s.estado);
	const sincronizando = useEstadoSync((s) => s.sincronizando);

	const etiqueta = sincronizando ? "Sincronizando…" : textoGlobal[estado];
	const punto = colorPunto(sincronizando, online, estado, pendientes);

	const alClickear = () => {
		if (!online) {
			toast.error("Sin conexión — no se puede sincronizar ahora");
			return;
		}
		pedirSync();
	};

	return (
		<button
			type='button'
			onClick={alClickear}
			disabled={sincronizando}
			aria-label={`Estado de sincronización: ${etiqueta}. Tocá para sincronizar.`}
			className='fixed z-40 top-[calc(env(safe-area-inset-top)+0.5rem)] right-3 flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/95 backdrop-blur-sm px-2.5 py-1 shadow-sm text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-80'
		>
			{sincronizando ? (
				<span className='w-2 h-2 rounded-full shrink-0 bg-slate-400 animate-pulse' aria-hidden />
			) : (
				<span className={`w-2 h-2 rounded-full shrink-0 ${punto}`} aria-hidden />
			)}
			<span>{etiqueta}</span>
			{pendientes > 0 && (
				<span className='min-w-[1.125rem] rounded-full bg-amber-100 text-amber-800 px-1 text-[10px] font-medium leading-4 text-center'>
					{pendientes > 99 ? "99+" : pendientes}
				</span>
			)}
		</button>
	);
};

export default IndicadorSync;
