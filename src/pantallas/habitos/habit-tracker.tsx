import { api } from "@/api/api";
import { ResumenSemanalDTO, UpsertRegistroHabitoDTO } from "@/api/clients";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { queryKeys } from "@/api/query-keys";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import HabitTrackerGrid from "./habit-tracker-grid";
import HabitTrackerPlaceholder from "./habit-tracker-placeholder";
import {
	diasDeSemana,
	esDomingo,
	esMismaFecha,
	formatearFechaClave,
	inicioDeSemana,
	nombreDiaCorto,
} from "./utilidades-habitos";

const ResumenDomingo = ({ resumen }: { resumen: ResumenSemanalDTO }) => {
	const [expandido, setExpandido] = useState(true);

	if (!resumen.habitos?.length) return null;

	return (
		<div className='mt-3 border border-amber-200 bg-amber-50 rounded-lg p-3'>
			<button
				type='button'
				onClick={() => setExpandido(!expandido)}
				className='w-full text-left font-medium text-sm text-amber-900'
			>
				Resumen de la semana {expandido ? "▾" : "▸"}
			</button>
			{expandido && (
				<ul className='mt-2 space-y-1'>
					{resumen.habitos.map((h) => (
						<li key={h.id} className='text-sm text-amber-800'>
							{h.nombre}: {h.diasCumplidos}/7 cumplidos
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

interface Props {
	ocultarSemanaActual: boolean;
}

const HabitTracker = ({ ocultarSemanaActual }: Props) => {
	const queryClient = useQueryClient();

	const [semanaReferencia, setSemanaReferencia] = useState(() => inicioDeSemana(new Date()));
	const [diaSeleccionado, setDiaSeleccionado] = useState(() => new Date());

	const diasSemana = useMemo(() => diasDeSemana(semanaReferencia), [semanaReferencia]);
	const hoy = new Date();
	const fechaConsulta = ocultarSemanaActual ? hoy : diaSeleccionado;

	const { data, isLoading } = useApiQuery({
		key: [...queryKeys.habitosTracker, formatearFechaClave(fechaConsulta)],
		fn: () => api.tracker(fechaConsulta),
	});

	const { data: resumenSemanal } = useApiQuery({
		key: [...queryKeys.habitosResumenSemanal, formatearFechaClave(new Date())],
		fn: () => api.resumenSemanal(new Date()),
		activado: !ocultarSemanaActual && esDomingo(),
	});

	const refetchTracker = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: queryKeys.habitosTracker });
		queryClient.invalidateQueries({ queryKey: queryKeys.habitosResumenSemanal });
	}, [queryClient]);

	const guardarRegistro = useCallback(async (dto: UpsertRegistroHabitoDTO) => {
		await api.registro(dto);
	}, []);

	const semanaAnterior = () => {
		const nueva = new Date(semanaReferencia);
		nueva.setDate(nueva.getDate() - 7);
		setSemanaReferencia(nueva);
	};

	const semanaSiguiente = () => {
		const nueva = new Date(semanaReferencia);
		nueva.setDate(nueva.getDate() + 7);
		setSemanaReferencia(nueva);
	};

	const esSemanaActual = esMismaFecha(semanaReferencia, inicioDeSemana(new Date()));

	if (isLoading && !data) {
		return <HabitTrackerPlaceholder ocultarSemanaActual={ocultarSemanaActual} />;
	}

	const habitos = data?.habitos ?? [];

	if (ocultarSemanaActual) {
		return (
			<div className='mb-4'>
				<HabitTrackerGrid
					habitos={habitos}
					fecha={fechaConsulta}
					onGuardado={refetchTracker}
					guardarRegistro={guardarRegistro}
				/>
			</div>
		);
	}

	return (
		<div className='mb-6 pb-4 border-b border-gray-200'>
			<div className='flex items-center justify-between mb-2'>
				<button type='button' onClick={semanaAnterior} className='p-1 rounded hover:bg-gray-100'>
					<ChevronLeftIcon className='w-4 h-4' />
				</button>
				<span className='text-xs text-gray-500'>
					{esSemanaActual ? "Semana actual" : "Semana seleccionada"}
				</span>
				<button type='button' onClick={semanaSiguiente} className='p-1 rounded hover:bg-gray-100'>
					<ChevronRightIcon className='w-4 h-4' />
				</button>
			</div>

			<div className='flex gap-1 mb-3 overflow-x-auto'>
				{diasSemana.map((dia) => {
					const seleccionado = esMismaFecha(dia, diaSeleccionado);
					const esHoy = esMismaFecha(dia, hoy);
					return (
						<button
							key={formatearFechaClave(dia)}
							type='button'
							onClick={() => setDiaSeleccionado(dia)}
							className={`flex-shrink-0 px-2 py-1 text-xs rounded-md min-w-[44px] ${
								seleccionado
									? "bg-gray-800 text-white"
									: esHoy
										? "bg-gray-100 text-gray-800 font-medium"
										: "text-gray-500 hover:bg-gray-50"
							}`}
						>
							{nombreDiaCorto(dia)} {dia.getDate()}
						</button>
					);
				})}
			</div>

			<HabitTrackerGrid
				habitos={habitos}
				fecha={fechaConsulta}
				onGuardado={refetchTracker}
				guardarRegistro={guardarRegistro}
			/>

			{esDomingo() && resumenSemanal && <ResumenDomingo resumen={resumenSemanal} />}
		</div>
	);
};

export default HabitTracker;
