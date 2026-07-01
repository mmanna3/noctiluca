import { TrackerHabitoView } from "@/sync/lecturas-core";
import HabitTrackerCelda from "./habit-tracker-celda";

interface Props {
	habitos: TrackerHabitoView[];
	fecha: Date;
	guardarRegistro: (params: {
		habitoClientId: string;
		habitoId?: number;
		fecha: Date;
		valorBooleano?: boolean;
		valorNumerico?: number;
	}) => Promise<void>;
}

const HabitTrackerGrid = ({ habitos, fecha, guardarRegistro }: Props) => {
	if (habitos.length === 0) {
		return (
			<p className='text-sm text-gray-500 text-center py-4'>
				No hay hábitos activos. Configuralos desde el menú /.
			</p>
		);
	}

	return (
		<div className='overflow-x-auto'>
			<div
				className='grid gap-2 min-w-full'
				style={{ gridTemplateColumns: `repeat(${habitos.length}, minmax(64px, 1fr))` }}
			>
				{habitos.map((habito) => (
					<div key={habito.clientId} className='flex flex-col gap-1 min-w-[64px]'>
						<span
							className='text-xs font-medium text-center truncate px-1'
							title={habito.nombre}
						>
							{habito.nombre}
						</span>
						<HabitTrackerCelda
							habito={habito}
							fecha={fecha}
							guardarRegistro={guardarRegistro}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default HabitTrackerGrid;
