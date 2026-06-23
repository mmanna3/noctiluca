import { HabitoTrackerItemDTO, TipoHabitoEnum, UpsertRegistroHabitoDTO } from "@/api/clients";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { esHabitoNumerico, esHabitoSiNo } from "./utilidades-habitos";

interface Props {
	habito: HabitoTrackerItemDTO;
	fecha: Date;
	onGuardado: () => void;
	guardarRegistro: (dto: UpsertRegistroHabitoDTO) => Promise<void>;
}

const HabitTrackerCelda = ({ habito, fecha, onGuardado, guardarRegistro }: Props) => {
	const [valorNumerico, setValorNumerico] = useState<string>(
		habito.valorNumerico != null ? String(habito.valorNumerico) : "",
	);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		setValorNumerico(habito.valorNumerico != null ? String(habito.valorNumerico) : "");
	}, [habito.valorNumerico, habito.id, fecha]);

	const mutation = useMutation({
		mutationFn: guardarRegistro,
		onSuccess: () => onGuardado(),
		onError: (error: unknown) => {
			const mensaje =
				error instanceof Error
					? JSON.parse((error as unknown as { response: string }).response).title
					: "Error al guardar el hábito";
			toast.error(mensaje);
		},
	});

	const guardar = (valorBooleano?: boolean, valorNum?: number) => {
		mutation.mutate(
			new UpsertRegistroHabitoDTO({
				habitoId: habito.id,
				fecha,
				valorBooleano,
				valorNumerico: valorNum,
			}),
		);
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
				className='flex items-center justify-center min-h-[44px] w-full text-2xl rounded-md border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors'
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
