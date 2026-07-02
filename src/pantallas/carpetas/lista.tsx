import { api } from "@/api/api";
import { ActualizarPosicionesDTO, CarpetaDTO, PosicionCarpetaDTO } from "@/api/clients";
import { queryKeys } from "@/api/query-keys";
import { useEstadoSync } from "@/sync/estado-sync";
import { pedirSync } from "@/sync/pedir-sync";
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import ListaDeCarpetasItem from "./lista-item";

interface IListaDeCarpetas {
	data: CarpetaDTO[];
	isLoading: boolean;
	isError: boolean;
}

function CarpetasLista(props: IListaDeCarpetas) {
	const [items, setItems] = useState<CarpetaDTO[]>(props.data);
	const [isUpdatingPositions, setIsUpdatingPositions] = useState(false);
	const queryClient = useQueryClient();
	const online = useEstadoSync((s) => s.online);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		if (active.id !== over?.id) {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over?.id);

			const newItems = arrayMove(items, oldIndex, newIndex);
			setItems(newItems);

			await updatePositions(newItems);
		}
	};

	const updatePositions = async (reorderedData: CarpetaDTO[]) => {
		setIsUpdatingPositions(true);
		try {
			const posiciones: PosicionCarpetaDTO[] = reorderedData
				.filter((c) => c.id !== undefined)
				.map(
					(c, index) =>
						new PosicionCarpetaDTO({
							idDeCarpeta: c.id as number,
							posicion: index + 1,
						}),
				);

			await api.actualizarPosiciones(new ActualizarPosicionesDTO({ posiciones }));

			await queryClient.invalidateQueries({ queryKey: queryKeys.carpetas });
			pedirSync();

			toast.success("Orden de carpetas actualizado");
		} catch {
			toast.error("Error al actualizar el orden de las carpetas");
		} finally {
			setIsUpdatingPositions(false);
		}
	};

	useEffect(() => {
		setItems(props.data);
	}, [props.data]);

	if (items.length === 0) {
		return null;
	}

	const listaEstatica = (
		<div className='space-y-0'>
			{items.map((c) => (
				<ListaDeCarpetasItem
					{...c}
					key={c.id || c.titulo}
					isDisabled
				/>
			))}
		</div>
	);

	if (!online) {
		return listaEstatica;
	}

	return (
		<div className='relative'>
			{isUpdatingPositions && (
				<div className='absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-50 flex items-center justify-center z-10'>
					<div className='flex items-center gap-2 text-sm text-gray-600'>
						<LoadingSpinner />
						Actualizando orden...
					</div>
				</div>
			)}
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext
					items={items.map((item) => item.id || "")}
					strategy={verticalListSortingStrategy}
				>
					<div className='space-y-0'>
						{items.map((c) => (
							<ListaDeCarpetasItem
								{...c}
								key={c.id || c.titulo}
								isDisabled={isUpdatingPositions}
							/>
						))}
					</div>
				</SortableContext>
			</DndContext>
		</div>
	);
}

export default CarpetasLista;
