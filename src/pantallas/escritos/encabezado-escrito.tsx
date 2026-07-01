import { ChevronLeftIcon, PaperAirplaneIcon, TrashIcon } from "@heroicons/react/24/solid";
import { EstadoGuardado } from "@/sync/tipos";
import { Boton } from "../../components/ui/botones";
import Encabezado from "../../components/ui/encabezado";
import { LoadingSpinner } from "../../components/ui/loading-spinner";

interface Props {
	titulo: string;
	carpetaTitulo: string;
	vieneDePapelera: boolean;
	estadoGuardado: EstadoGuardado;
	eliminando: boolean;
	onVolver: () => void;
	onMover: () => void;
	onEliminar: () => void;
}

const textoEstado: Record<EstadoGuardado, string> = {
	guardado: "Guardado",
	guardando: "Guardando…",
	pendiente: "Pendiente",
	"sin-conexion": "Sin conexión",
	error: "Error al sincronizar",
};

const colorEstado: Record<EstadoGuardado, string> = {
	guardado: "text-slate-400",
	guardando: "text-slate-400",
	pendiente: "text-slate-400",
	"sin-conexion": "text-amber-500",
	error: "text-red-500",
};

const IndicadorGuardado = ({ estado }: { estado: EstadoGuardado }) => (
	<span
		className={`text-xs ${colorEstado[estado]}`}
		role='status'
		aria-live='polite'
	>
		{textoEstado[estado]}
	</span>
);

const EncabezadoEscrito = ({
	titulo,
	carpetaTitulo,
	vieneDePapelera,
	estadoGuardado,
	eliminando,
	onVolver,
	onMover,
	onEliminar,
}: Props) => (
	<Encabezado>
		<Boton
			soloBorde
			className='flex justify-between items-center'
			onClick={onVolver}
		>
			<ChevronLeftIcon className='w-4 h-4 mr-2' />
			{vieneDePapelera ? "Papelera" : carpetaTitulo}/{titulo}
		</Boton>
		<div className='flex items-center gap-2'>
			{!vieneDePapelera && <IndicadorGuardado estado={estadoGuardado} />}
			{!vieneDePapelera && (
				<Boton
					sinBorde
					className='text-slate-400 hover:bg-yellow-200'
					onClick={onMover}
				>
					<PaperAirplaneIcon className='h-5 w-5' />
				</Boton>
			)}
			<Boton
				soloBorde
				className='border-none text-slate-400'
				onClick={onEliminar}
				disabled={eliminando}
			>
				{eliminando ? (
					<LoadingSpinner className='h-5 w-5' />
				) : (
					<TrashIcon className='h-5 w-5' />
				)}
			</Boton>
		</div>
	</Encabezado>
);

export default EncabezadoEscrito;
