import { TipoHabitoEnum } from "@/api/clients";
import { TrackerHabitoView } from "@/sync/lecturas-core";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { esHabitoNumerico, esHabitoSiNo } from "./utilidades-habitos";

interface Props {
	habito: TrackerHabitoView;
	fecha: Date;
	guardarRegistro: (params: {
		habitoClientId: string;
		habitoId?: number;
		fecha: Date;
		valorBooleano?: boolean;
		valorNumerico?: number;
	}) => Promise<void>;
}

const HabitTrackerCelda = ({ habito, fecha, guardarRegistro }: Props) => {
	const [valorNumerico, setValorNumerico] = useState<string>(
		habito.valorNumerico != null ? String(habito.valorNumerico) : "",
	);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		setValorNumerico(habito.valorNumerico != null ? String(habito.valorNumerico) : "");
	}, [habito.valorNumerico, habito.clientId, fecha]);

	const mutation = useMutation({
		mutationFn: guardarRegistro,
		onError: () => toast.error("Error al guardar el hábito"),
	});

	const guardar = (valorBooleano?: boolean, valorNum?: number) => {
		mutation.mutate({
			habitoClientId: habito.clientId,
			habitoId: habito.id,
			fecha,
			valorBooleano,
			valorNumerico: valorNum,
		});
	};

	const alternarSiNo = () => {
		const nuevoValor = !(habito.valorBooleano === true);
		guardar(nuevoValor, undefined);
	};

	const cuandoCambiaNumerico = (e: React.ChangeEvent<HTMLInputElement>) => {
		const texto = e.target.value;
		setValorNumerico(texto);

		if (debounceRef.current) clearTimeout(debounceRef.current);

		debounceRef.current = setTimeout(() => {
			if (texto === "") return;
			const numero = parseInt(texto, 10);
			if (!isNaN(numero) && numero >= 0) {
				guardar(undefined, numero);
			}
		}, 500);
	};

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, []);

	if (esHabitoSiNo(habito.tipo ?? TipoHabitoEnum._1)) {
		return (
			<button
				type='button'
				onClick={alternarSiNo}
				disabled={mutation.isPending}
				className='flex items-center justify-center min-h-[44px] w-full text-3xl'
				aria-label={habito.valorBooleano ? "Cumplido" : "No cumplido"}
			>
				{habito.valorBooleano === true ? "☑" : "☐"}
			</button>
		);
	}

	if (esHabitoNumerico(habito.tipo)) {
		return (
			<input
				type='number'
				min={0}
				inputMode='numeric'
				value={valorNumerico}
				onChange={cuandoCambiaNumerico}
				disabled={mutation.isPending}
				className='w-full min-h-[44px] text-center text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400'
				placeholder='0'
			/>
		);
	}

	return null;
};

export default HabitTrackerCelda;
