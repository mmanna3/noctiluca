import { api } from "@/api/api";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { HabitoResumenDTO } from "@/api/clients";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Boton } from "@/components/ui/botones";
import Cuerpo from "@/components/ui/cuerpo";
import Encabezado from "@/components/ui/encabezado";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import usarNavegacion from "@/usar-navegacion";
import {
	diasDeSemana,
	esHabitoNumerico,
	formatearFechaClave,
	inicioDeSemana,
	nombreDiaCorto,
} from "./utilidades-habitos";

const iconoEstado = (estado?: string): string => {
	switch (estado) {
		case "cumplido":
			return "✓";
		case "no_cumplido":
			return "✗";
		default:
			return "—";
	}
};

const TablaHabito = ({ habito, diasSemana }: { habito: HabitoResumenDTO; diasSemana: Date[] }) => {
	return (
		<div className='mb-6'>
			<h3 className='font-medium mb-2'>{habito.nombre}</h3>
			<div className='overflow-x-auto'>
				<table className='w-full text-sm border-collapse'>
					<thead>
						<tr>
							{diasSemana.map((dia) => (
								<th
									key={formatearFechaClave(dia)}
									className='border border-gray-200 px-2 py-1 text-xs font-normal text-gray-500'
								>
									{nombreDiaCorto(dia)}
									<br />
									{dia.getDate()}
								</th>
							))}
							<th className='border border-gray-200 px-2 py-1 text-xs font-normal text-gray-500'>
								Total
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							{habito.detallePorDia?.map((detalle, i) => (
								<td
									key={i}
									className='border border-gray-200 px-2 py-2 text-center text-lg'
									title={
										esHabitoNumerico(habito.tipo) && detalle.valorNumerico != null
											? `${detalle.valorNumerico} min`
											: detalle.estado
									}
								>
									{esHabitoNumerico(habito.tipo) && detalle.valorNumerico != null
										? detalle.valorNumerico
										: iconoEstado(detalle.estado)}
								</td>
							))}
							<td className='border border-gray-200 px-2 py-2 text-center text-sm font-medium'>
								{habito.diasCumplidos}/7
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			{esHabitoNumerico(habito.tipo) && (
				<p className='text-xs text-gray-500 mt-1'>
					Total: {habito.totalMinutos ?? 0} min · Promedio: {habito.promedioMinutos ?? 0} min/día
					marcado
				</p>
			)}
		</div>
	);
};

const ResumenSemanal = () => {
	const { irAlInicio } = usarNavegacion();
	const [semanaReferencia, setSemanaReferencia] = useState(() => new Date());

	const { data, isLoading } = useApiQuery({
		key: ["habitos-resumen-semanal", formatearFechaClave(semanaReferencia)],
		fn: () => api.resumenSemanal(semanaReferencia),
	});

	const diasSemana = useMemo(() => diasDeSemana(semanaReferencia), [semanaReferencia]);

	const datosGrafico = useMemo(
		() =>
			data?.habitos?.map((h) => ({
				nombre: h.nombre ?? "",
				cumplidos: h.diasCumplidos ?? 0,
			})) ?? [],
		[data],
	);

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

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-full'>
				<LoadingSpinner />
			</div>
		);
	}

	const inicio = inicioDeSemana(semanaReferencia);
	const fin = diasSemana[6];

	return (
		<>
			<Encabezado>
				<Boton soloBorde className='flex items-center' onClick={irAlInicio}>
					<ChevronLeftIcon className='w-4 h-4 mr-2' />
					Resumen semanal
				</Boton>
			</Encabezado>
			<Cuerpo>
				<div className='flex items-center justify-between mb-4'>
					<button type='button' onClick={semanaAnterior} className='text-sm text-gray-600'>
						← Anterior
					</button>
					<span className='text-sm text-gray-500'>
						{inicio.getDate()}/{inicio.getMonth() + 1} – {fin.getDate()}/{fin.getMonth() + 1}
					</span>
					<button type='button' onClick={semanaSiguiente} className='text-sm text-gray-600'>
						Siguiente →
					</button>
				</div>

				{!data?.habitos?.length ? (
					<p className='text-sm text-gray-500 text-center py-8'>
						No hay hábitos activos para mostrar.
					</p>
				) : (
					<>
						<div className='mb-8 h-48'>
							<h3 className='text-sm font-medium text-gray-600 mb-2'>Días cumplidos por hábito</h3>
							<ResponsiveContainer width='100%' height='100%'>
								<BarChart data={datosGrafico} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
									<XAxis dataKey='nombre' tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor='end' height={50} />
									<YAxis allowDecimals={false} domain={[0, 7]} tick={{ fontSize: 10 }} />
									<Tooltip />
									<Bar dataKey='cumplidos' fill='#374151' radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>

						{data.habitos.map((habito) => (
							<TablaHabito key={habito.id} habito={habito} diasSemana={diasSemana} />
						))}
					</>
				)}
			</Cuerpo>
		</>
	);
};

export default ResumenSemanal;
