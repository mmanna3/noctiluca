import { useAuth } from "@/hooks/use-auth";
import { usePreferenciasHabitos } from "@/hooks/use-preferencias-habitos";
import usarNavegacion from "@/usar-navegacion";

interface Props {
	onCerrar: () => void;
}

const MenuHabitos = ({ onCerrar }: Props) => {
	const { esAdmin } = useAuth();
	const { irAHabitos, irAResumenHabitos } = usarNavegacion();
	const { ocultarSemanaActual, setOcultarSemanaActual } = usePreferenciasHabitos();

	return (
		<div className='mb-4 border border-gray-200 rounded-lg p-3 space-y-3'>
			<button
				type='button'
				onClick={() => {
					irAResumenHabitos();
					onCerrar();
				}}
				className='block w-full text-left text-sm text-gray-700 hover:text-gray-900 underline'
			>
				Ver resumen
			</button>

			{esAdmin() && (
				<button
					type='button'
					onClick={() => {
						irAHabitos();
						onCerrar();
					}}
					className='block w-full text-left text-sm text-gray-700 hover:text-gray-900 underline'
				>
					Administrar hábitos
				</button>
			)}

			<label className='flex items-center gap-2 text-sm text-gray-700 cursor-pointer'>
				<input
					type='checkbox'
					checked={ocultarSemanaActual}
					onChange={(e) => setOcultarSemanaActual(e.target.checked)}
					className='rounded'
				/>
				Ocultar semana actual
			</label>
		</div>
	);
};

export default MenuHabitos;
