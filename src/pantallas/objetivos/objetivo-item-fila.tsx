import { CrearItemObjetivoDTO, EditarItemObjetivoDTO, ItemObjetivoDTO } from "@/api/clients";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation } from "@tanstack/react-query";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
	item: ItemObjetivoDTO;
	onActualizado: () => void;
	onToggle: (id: number) => Promise<void>;
	onEditar: (id: number, dto: EditarItemObjetivoDTO) => Promise<void>;
	onEliminar: (id: number) => Promise<void>;
	onCrearDebajo?: (despuesDeItemId: number) => Promise<void>;
	reordenable?: boolean;
	autoFocus?: boolean;
}

const ObjetivoItemFila = ({
	item,
	onActualizado,
	onToggle,
	onEditar,
	onEliminar,
	onCrearDebajo,
	reordenable = false,
	autoFocus = false,
}: Props) => {
	const [texto, setTexto] = useState(item.texto ?? "");
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: item.id!,
		disabled: !reordenable,
	});

	useEffect(() => {
		setTexto(item.texto ?? "");
	}, [item.id, item.texto]);

	useEffect(() => {
		if (autoFocus) {
			inputRef.current?.focus();
		}
	}, [autoFocus, item.id]);

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

	const guardarTexto = async (nuevoTexto: string) => {
		const trimmed = nuevoTexto.trim();
		if (!trimmed || trimmed === (item.texto ?? "").trim()) return;

		await onEditar(item.id!, new EditarItemObjetivoDTO({ texto: trimmed }))
			.then(() => onActualizado())
			.catch(() => toast.error("Error al guardar el objetivo"));
	};

	const cuandoCambiaTexto = (valor: string) => {
		setTexto(valor);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => guardarTexto(valor), 500);
	};

	const alPresionarTecla = async (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== "Enter" || !onCrearDebajo) return;

		e.preventDefault();
		if (debounceRef.current) clearTimeout(debounceRef.current);
		await guardarTexto(texto);
		await onCrearDebajo(item.id!);
	};

	useEffect(
		() => () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		},
		[],
	);

	const style = reordenable
		? {
				transform: CSS.Transform.toString(transform),
				transition,
				opacity: isDragging ? 0.5 : 1,
			}
		: undefined;

	return (
		<div
			ref={reordenable ? setNodeRef : undefined}
			style={style}
			className='flex items-center gap-2 py-1 group touch-none'
			{...(reordenable ? { ...attributes, ...listeners } : {})}
		>
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
				ref={inputRef}
				type='text'
				value={texto}
				onChange={(e) => cuandoCambiaTexto(e.target.value)}
				onBlur={() => guardarTexto(texto)}
				onKeyDown={alPresionarTecla}
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
	posicion?: number,
): CrearItemObjetivoDTO =>
	new CrearItemObjetivoDTO({
		listaObjetivoId,
		texto: texto.trim(),
		posicion,
	});
