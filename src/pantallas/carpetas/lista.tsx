import { api } from "@/api/api";
import { ActualizarPosicionesDTO, CarpetaDTO, PosicionCarpetaDTO } from "@/api/clients";
import { queryKeys } from "@/api/query-keys";
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
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import ListaDeCarpetasItem from "./lista-item";

interface IListaDeCarpetas {
	data: CarpetaDTO[];
	isLoading: boolean;
	isError: boolean;
}

function CarpetasLista(props: IListaDeCarpetas) {
	const carpetasSistema = useMemo(
		() => props.data.filter((c) => c.esSistema),
		[props.data],
	);
	const carpetasNormales = useMemo(
		() => props.data.filter((c) => !c.esSistema),
		[props.data],
	);

	const [items, setItems] = useState<CarpetaDTO[]>(carpetasNormales);
	const [isUpdatingPositions, setIsUpdatingPositions] = useState(false);
	const queryClient = useQueryClient();

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
				.filter((carpeta) => carpeta.id !== undefined)
				.map(
					(carpeta, index) =>
						new PosicionCarpetaDTO({
							idDeCarpeta: carpeta.id as number,
							posicion: index + 1,
						}),
				);

			const actualizarPosicionesDTO = new ActualizarPosicionesDTO({
				posiciones: posiciones,
			});

			await api.actualizarPosiciones(actualizarPosicionesDTO);

			await queryClient.invalidateQueries({ queryKey: queryKeys.carpetas });

			toast.success("Orden de carpetas actualizado");
		} catch (error) {
			toast.error("Error al actualizar el orden de las carpetas");
		} finally {
			setIsUpdatingPositions(false);
		}
	};

	useEffect(() => {
		setItems(carpetasNormales);
	}, [carpetasNormales]);

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
			<div className='space-y-0'>
				{carpetasSistema.map((carpeta) => (
					<ListaDeCarpetasItem
						{...carpeta}
						key={carpeta.id || carpeta.titulo}
						esSistema
						isDisabled
					/>
				))}
			</div>
			{carpetasNormales.length > 0 && (
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
			)}
		</div>
	);
}

export default CarpetasLista;
