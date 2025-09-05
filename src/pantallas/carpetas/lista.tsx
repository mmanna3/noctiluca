import { api } from "@/api/api";
import { ActualizarPosicionesDTO, CarpetaDTO, PosicionCarpetaDTO } from "@/api/clients";
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

			// Update positions in the backend
			await updatePositions(newItems);
		}
	};

	const updatePositions = async (reorderedData: CarpetaDTO[]) => {
		setIsUpdatingPositions(true);
		try {
			// Create the positions array with the new order
			const posiciones: PosicionCarpetaDTO[] = reorderedData
				.filter((carpeta) => carpeta.id !== undefined)
				.map(
					(carpeta, index) =>
						new PosicionCarpetaDTO({
							idDeCarpeta: carpeta.id as number,
							posicion: index + 1, // Positions start from 1
						}),
				);

			// Create the DTO for the API call
			const actualizarPosicionesDTO = new ActualizarPosicionesDTO({
				posiciones: posiciones,
			});

			// Call the API to update positions
			await api.actualizarPosiciones(actualizarPosicionesDTO);

			toast.success("Orden de carpetas actualizado");
		} catch (error) {
			toast.error("Error al actualizar el orden de las carpetas");
		} finally {
			setIsUpdatingPositions(false);
		}
	};

	// Update local state when props.data changes
	useEffect(() => {
		setItems(props.data);
	}, [props.data]);

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
						{items.map((carpeta: CarpetaDTO) => (
							<ListaDeCarpetasItem
								{...carpeta}
								key={carpeta.id || carpeta.titulo}
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
