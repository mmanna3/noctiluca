import { CrearItemObjetivoDTO, EditarItemObjetivoDTO, ItemObjetivoDTO } from "@/api/clients";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
	item: ItemObjetivoDTO;
	onActualizado: () => void;
	onToggle: (id: number) => Promise<void>;
	onEditar: (id: number, dto: EditarItemObjetivoDTO) => Promise<void>;
	onEliminar: (id: number) => Promise<void>;
}

const ObjetivoItemFila = ({ item, onActualizado, onToggle, onEditar, onEliminar }: Props) => {
	const [texto, setTexto] = useState(item.texto ?? "");
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		setTexto(item.texto ?? "");
	}, [item.id, item.texto]);

	const toggleMutation = useMutation({
		mutationFn: () => onToggle(item.id!),
		onSuccess: () => onActualizado(),
		onError: () => toast.error("Error al actualizar el objetivo"),
	});

	const eliminarMutation = useMutation({
		mutationFn: () => onEliminar(item.id!),
		onSuccess: () => onActualizado(),
		onError: () => toast.error("Error al eliminar el objetivo"),
	});

	const guardarTexto = (nuevoTexto: string) => {
		const trimmed = nuevoTexto.trim();
		if (!trimmed || trimmed === (item.texto ?? "").trim()) return;

		onEditar(item.id!, new EditarItemObjetivoDTO({ texto: trimmed }))
			.then(() => onActualizado())
			.catch(() => toast.error("Error al guardar el objetivo"));
	};

	const cuandoCambiaTexto = (valor: string) => {
		setTexto(valor);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => guardarTexto(valor), 500);
	};

	useEffect(
		() => () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		},
		[],
	);

	return (
		<div className='flex items-center gap-2 py-1 group'>
			<button
				type='button'
				onClick={() => toggleMutation.mutate()}
				disabled={toggleMutation.isPending}
				className='flex-shrink-0 text-2xl leading-none min-w-[36px] min-h-[36px] flex items-center justify-center'
				aria-label={item.completado ? "Completado" : "Pendiente"}
			>
				{item.completado ? "☑" : "☐"}
			</button>
			<input
				type='text'
				value={texto}
				onChange={(e) => cuandoCambiaTexto(e.target.value)}
				onBlur={() => guardarTexto(texto)}
				disabled={toggleMutation.isPending}
				className={`flex-1 bg-transparent border-none outline-none text-sm py-1 ${
					item.completado ? "line-through text-gray-400" : "text-gray-800"
				}`}
			/>
			<button
				type='button'
				onClick={() => eliminarMutation.mutate()}
				disabled={eliminarMutation.isPending}
				className='opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-lg px-1 transition-opacity'
				aria-label='Eliminar objetivo'
			>
				×
			</button>
		</div>
	);
};

export default ObjetivoItemFila;

export const crearItemRequest = (
	listaObjetivoId: number,
	texto: string,
): CrearItemObjetivoDTO =>
	new CrearItemObjetivoDTO({
		listaObjetivoId,
		texto: texto.trim(),
	});
