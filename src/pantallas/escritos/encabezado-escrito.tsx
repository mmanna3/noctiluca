import { ChevronLeftIcon, PaperAirplaneIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Boton } from "../../components/ui/botones";
import Encabezado from "../../components/ui/encabezado";
import { LoadingSpinner } from "../../components/ui/loading-spinner";

interface Props {
	titulo: string;
	carpetaTitulo: string;
	vieneDePapelera: boolean;
	guardando: boolean;
	eliminando: boolean;
	onVolver: () => void;
	onMover: () => void;
	onEliminar: () => void;
}

const EncabezadoEscrito = ({
	titulo,
	carpetaTitulo,
	vieneDePapelera,
	guardando,
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
			disabled={guardando}
		>
			{guardando ? (
				<LoadingSpinner className='w-4 h-4 mr-2' />
			) : (
				<ChevronLeftIcon className='w-4 h-4 mr-2' />
			)}
			{vieneDePapelera ? "Papelera" : carpetaTitulo}/{titulo}
		</Boton>
		<div className='flex items-center gap-1'>
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
