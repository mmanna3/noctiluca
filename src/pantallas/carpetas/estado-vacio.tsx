import { Boton } from "../../components/ui/botones";

interface Props {
	onEliminar?: () => void;
}

const EstadoVacio = ({ onEliminar }: Props) => (
	<div className='flex flex-col justify-center items-center h-full g-2'>
		<div className='text-sm text-gray-500'>No hay escritos en esta carpeta.</div>
		{onEliminar && (
			<Boton
				soloBorde
				className='flex justify-between items-center mt-4'
				onClick={onEliminar}
			>
				¿Eliminar carpeta?
			</Boton>
		)}
	</div>
);

export default EstadoVacio;
