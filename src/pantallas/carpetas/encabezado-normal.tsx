import { ChevronLeftIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Boton, BotonIcono } from "../../components/ui/botones";
import Encabezado from "../../components/ui/encabezado";

interface Props {
	titulo: string;
	onVolver: () => void;
	onNuevoEscrito: () => void;
}

const EncabezadoNormal = ({ titulo, onVolver, onNuevoEscrito }: Props) => (
	<Encabezado>
		<Boton soloBorde className='flex justify-between items-center' onClick={onVolver}>
			<ChevronLeftIcon className='w-4 h-4 mr-2' />/{titulo}
		</Boton>
		<div className='flex items-center gap-2'>
			<BotonIcono onClick={onNuevoEscrito}>
				<PlusIcon className='h-8 w-8' />
			</BotonIcono>
		</div>
	</Encabezado>
);

export default EncabezadoNormal;
