import { api } from "@/api/api";
import {
	ActualizarPosicionesItemObjetivoDTO,
	CrearItemObjetivoDTO,
	EditarItemObjetivoDTO,
	ItemObjetivoDTO,
	ListaObjetivoDTO,
	PosicionItemObjetivoDTO,
	TipoListaObjetivoEnum,
} from "@/api/clients";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { queryKeys } from "@/api/query-keys";
import { claveDeItem } from "@/sync/lecturas-core";
import { usarListaObjetivos, usarListaObjetivosPorId } from "@/sync/lecturas";
import {
	crearItemObjetivoLocal,
	editarItemObjetivoLocal,
	eliminarItemObjetivoLocal,
	reordenarItemsObjetivoLocal,
	toggleItemObjetivoLocal,
} from "@/sync/repositorio-objetivos";
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
import { PlusIcon } from "@heroicons/react/24/solid";
import { useQueryClient } from "@tanstack/react-query";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { formatearFechaClave } from "../habitos/utilidades-habitos";
import ObjetivoItemFila, { crearItemRequest } from "./objetivo-item-fila";
import { tituloPeriodoActual } from "./utilidades-objetivos";

interface Props {
	modoDia?: boolean;
	fecha?: Date;
	listaId?: number;
	tipo?: TipoListaObjetivoEnum;
	clavePeriodo?: string;
	titulo?: string;
}

const EditorListaObjetivos = ({
	modoDia = false,
	fecha = new Date(),
	listaId,
	tipo,
	clavePeriodo,
	titulo,
}: Props) => {
	const queryClient = useQueryClient();
	const [nuevoTexto, setNuevoTexto] = useState("");
	const [creando, setCreando] = useState(false);
	const [mostrarInputVacio, setMostrarInputVacio] = useState(false);
	const [itemConFoco, setItemConFoco] = useState<string | null>(null);
	const [itemsLocales, setItemsLocales] = useState<ItemObjetivoDTO[]>([]);

	const claveDia = formatearFechaClave(fecha);
	const tipoLocal = modoDia ? TipoListaObjetivoEnum._1 : tipo;
	const claveLocal = modoDia ? claveDia : clavePeriodo;

	const dataLocalPorClave = usarListaObjetivos(tipoLocal, claveLocal);
	const dataLocalPorId = usarListaObjetivosPorId(listaId);

	const usaLocal =
		modoDia || (!!tipo && !!clavePeriodo) || (listaId != null && dataLocalPorId !== null);

	const invalidarApi = () => {
		queryClient.invalidateQueries({ queryKey: queryKeys.objetivosDia });
		queryClient.invalidateQueries({ queryKey: ["objetivos-lista"] });
		queryClient.invalidateQueries({ queryKey: ["objetivos-historico"] });
	};

	const { data: dataApi, isLoading: cargandoApi } = useApiQuery({
		key: modoDia
			? [...queryKeys.objetivosDia, claveDia]
			: listaId
				? queryKeys.objetivosLista(listaId)
				: [...queryKeys.objetivosLista(`${tipo}-${clavePeriodo}`), tipo, clavePeriodo],
		fn: async (): Promise<ListaObjetivoDTO> => {
			if (modoDia) return api.dia(fecha);
			if (listaId) return api.lista2(listaId);
			if (tipo && clavePeriodo) {
				try {
					return await api.lista(tipo, clavePeriodo);
				} catch {
					return new ListaObjetivoDTO({
						tipo,
						clavePeriodo,
						items: [],
					});
				}
			}
			throw new Error("Configuración de lista inválida");
		},
		activado: !usaLocal && (modoDia || !!listaId || (!!tipo && !!clavePeriodo)),
	});

	const data = usaLocal
		? modoDia || (tipo && clavePeriodo)
			? dataLocalPorClave
			: dataLocalPorId ?? undefined
		: dataApi;

	const isLoading = usaLocal
		? modoDia || (tipo && clavePeriodo)
			? dataLocalPorClave === undefined
			: dataLocalPorId === undefined
		: cargandoApi && !dataApi;

	const listaTipo = data?.tipo ?? tipoLocal ?? TipoListaObjetivoEnum._1;
	const listaClave = data?.clavePeriodo ?? claveLocal ?? claveDia;

	useEffect(() => {
		setItemsLocales(data?.items ?? []);
	}, [data?.items]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { delay: 300, distance: 5 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const agregarItem = async (e?: FormEvent, texto?: string, posicion?: number) => {
		e?.preventDefault();
		const valor = (texto ?? nuevoTexto).trim();
		if (!valor && !modoDia) return;

		setCreando(true);
		try {
			if (usaLocal) {
				await crearItemObjetivoLocal({
					listaTipo,
					listaClavePeriodo: listaClave,
					texto: valor || " ",
					posicion,
				});
			} else if (data?.id) {
				await api.itemPOST(crearItemRequest(data.id, valor || " ", posicion));
				invalidarApi();
			} else if (tipo && clavePeriodo) {
				await api.itemPOST(
					new CrearItemObjetivoDTO({
						tipo,
						clavePeriodo,
						texto: valor || " ",
						posicion,
					}),
				);
				invalidarApi();
			}
			setNuevoTexto("");
			setMostrarInputVacio(false);
		} catch {
			toast.error("Error al agregar el objetivo");
		} finally {
			setCreando(false);
		}
	};

	const crearDebajo = async (despuesDeClientId: string) => {
		const indice = itemsLocales.findIndex((i) => claveDeItem(i) === despuesDeClientId);
		if (indice < 0) return;

		const posicionInsert = indice + 1;

		setCreando(true);
		try {
			if (usaLocal) {
				const clientId = await crearItemObjetivoLocal({
					listaTipo,
					listaClavePeriodo: listaClave,
					texto: " ",
					posicion: posicionInsert,
				});
				setItemConFoco(clientId);
			} else if (data?.id) {
				const creado = await api.itemPOST(
					crearItemRequest(data.id, " ", posicionInsert),
				);
				setItemConFoco(creado.clientId ?? String(creado.id ?? ""));
				invalidarApi();
			}
		} catch {
			toast.error("Error al agregar el objetivo");
		} finally {
			setCreando(false);
		}
	};

	const actualizarPosicionesLocal = async (reordenados: ItemObjetivoDTO[]) => {
		try {
			await reordenarItemsObjetivoLocal(
				reordenados.map((item, index) => ({
					clientId: claveDeItem(item),
					posicion: index,
				})),
			);
		} catch {
			toast.error("Error al reordenar los objetivos");
		}
	};

	const actualizarPosicionesApi = async (reordenados: ItemObjetivoDTO[]) => {
		try {
			const posiciones = reordenados
				.filter((i) => i.id !== undefined)
				.map(
					(item, index) =>
						new PosicionItemObjetivoDTO({
							idDeItem: item.id as number,
							posicion: index,
						}),
				);

			await api.posiciones(new ActualizarPosicionesItemObjetivoDTO({ posiciones }));
			invalidarApi();
		} catch {
			toast.error("Error al reordenar los objetivos");
		}
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = itemsLocales.findIndex((i) => claveDeItem(i) === active.id);
		const newIndex = itemsLocales.findIndex((i) => claveDeItem(i) === over.id);
		const reordenados = arrayMove(itemsLocales, oldIndex, newIndex);

		setItemsLocales(reordenados);
		if (usaLocal) {
			await actualizarPosicionesLocal(reordenados);
		} else {
			await actualizarPosicionesApi(reordenados);
		}
	};

	const tituloMostrado =
		titulo ??
		(modoDia
			? tituloPeriodoActual(TipoListaObjetivoEnum._1)
			: tipo
				? tituloPeriodoActual(tipo)
				: "Objetivos");

	const idsOrdenables = useMemo(() => itemsLocales.map(claveDeItem), [itemsLocales]);

	if (isLoading && !data) {
		if (modoDia) {
			return (
				<div className='mb-3 animate-pulse'>
					<div className='h-7 bg-gray-50 rounded' />
				</div>
			);
		}
		return (
			<div className='mb-4 pb-3 border-b border-gray-100 animate-pulse'>
				<div className='h-4 bg-gray-100 rounded w-24 mb-3' />
				<div className='h-8 bg-gray-50 rounded mb-2' />
			</div>
		);
	}

	const items = itemsLocales;
	const reordenable = items.length >= 2;
	const permitirEnterCrear = modoDia ? items.length > 0 : true;

	const onToggle = usaLocal
		? (clientId: string) => toggleItemObjetivoLocal(clientId)
		: (clientId: string) => {
			const item = items.find((i) => claveDeItem(i) === clientId);
			if (!item?.id) return Promise.resolve();
			return api.completado(item.id).then(() => undefined);
		};

	const onEditar = usaLocal
		? (clientId: string, textoEditado: string) => editarItemObjetivoLocal(clientId, textoEditado)
		: (clientId: string, textoEditado: string) => {
			const item = items.find((i) => claveDeItem(i) === clientId);
			if (!item?.id) return Promise.resolve();
			return api.itemPUT(item.id, new EditarItemObjetivoDTO({ texto: textoEditado })).then(() => undefined);
		};

	const onEliminar = usaLocal
		? (clientId: string) => eliminarItemObjetivoLocal(clientId)
		: (clientId: string) => {
			const item = items.find((i) => claveDeItem(i) === clientId);
			if (!item?.id) return Promise.resolve();
			return api.itemDELETE(item.id).then(() => undefined);
		};

	const filas = items.map((item) => (
		<ObjetivoItemFila
			key={claveDeItem(item)}
			item={item}
			onToggle={onToggle}
			onEditar={onEditar}
			onEliminar={onEliminar}
			onCrearDebajo={permitirEnterCrear ? crearDebajo : undefined}
			reordenable={reordenable}
			autoFocus={claveDeItem(item) === itemConFoco}
		/>
	));

	const contenidoItems =
		reordenable ? (
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={idsOrdenables} strategy={verticalListSortingStrategy}>
					<div className='space-y-0'>{filas}</div>
				</SortableContext>
			</DndContext>
		) : (
			<div className='space-y-0'>{filas}</div>
		);

	const altaModoDia =
		items.length === 0 ? (
			mostrarInputVacio ? (
				<form onSubmit={(e) => agregarItem(e)} className='mt-1'>
					<input
						type='text'
						value={nuevoTexto}
						onChange={(e) => setNuevoTexto(e.target.value)}
						onBlur={() => {
							if (!nuevoTexto.trim()) setMostrarInputVacio(false);
						}}
						autoFocus
						disabled={creando}
						className='w-full text-sm bg-transparent border-none outline-none py-1'
					/>
				</form>
			) : (
				<button
					type='button'
					onClick={() => setMostrarInputVacio(true)}
					className='mt-1 h-6 w-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded'
					aria-label='Agregar objetivo'
				>
					<PlusIcon className='h-4 w-4' />
				</button>
			)
		) : null;

	const altaNormal = !modoDia ? (
		<form onSubmit={(e) => agregarItem(e)} className='mt-2 flex gap-2'>
			<input
				type='text'
				value={nuevoTexto}
				onChange={(e) => setNuevoTexto(e.target.value)}
				placeholder='Agregar objetivo…'
				disabled={creando}
				className='flex-1 text-sm border border-gray-200 rounded-md px-2 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400'
			/>
		</form>
	) : null;

	if (modoDia) {
		return (
			<div className='mb-3'>
				{data?.advertenciaLimite && (
					<div className='mb-1 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded px-2 py-1'>
						{data.advertenciaLimite}
					</div>
				)}
				{contenidoItems}
				{altaModoDia}
			</div>
		);
	}

	return (
		<div className='mb-4 pb-4 border-b border-gray-200'>
			<h2 className='text-sm font-semibold text-gray-800 mb-2'>{tituloMostrado}</h2>
			{data?.advertenciaLimite && (
				<div className='mb-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded px-2 py-1'>
					{data.advertenciaLimite}
				</div>
			)}
			{contenidoItems}
			{altaNormal}
		</div>
	);
};

export default EditorListaObjetivos;
