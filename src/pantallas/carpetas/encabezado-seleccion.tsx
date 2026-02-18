import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Boton } from "../../components/ui/botones";
import Encabezado from "../../components/ui/encabezado";

interface Props {
	cantidadSeleccionados: number;
	onSeleccionarTodos: () => void;
	onMover: () => void;
	onCancelar: () => void;
	puedeMover: boolean;
}

const EncabezadoSeleccion = ({
	cantidadSeleccionados,
	onSeleccionarTodos,
	onMover,
	onCancelar,
	puedeMover,
}: Props) => (
	<Encabezado>
		<div className='flex items-center gap-2'>
			<span className='text-sm font-medium'>
				{cantidadSeleccionados} seleccionado
				{cantidadSeleccionados !== 1 ? "s" : ""}
			</span>
			<Boton className='hover:bg-yellow-200' sinBorde chiquito onClick={onSeleccionarTodos}>
				Todos
			</Boton>
		</div>
		<div className='flex items-center gap-1'>
			<Boton
				sinBorde
				className='text-slate-600 hover:bg-yellow-200'
				onClick={onMover}
				disabled={!puedeMover}
			>
				<PaperAirplaneIcon className='h-5 w-5' />
			</Boton>
			<Boton
				sinBorde
				className='text-slate-400 hover:bg-yellow-200'
				onClick={onCancelar}
			>
				<XMarkIcon className='h-5 w-5' />
			</Boton>
		</div>
	</Encabezado>
);

export default EncabezadoSeleccion;
