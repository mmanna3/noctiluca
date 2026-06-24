import { api } from "@/api/api";
import { CrearItemObjetivoDTO, ListaObjetivoDTO, TipoListaObjetivoEnum } from "@/api/clients";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { queryKeys } from "@/api/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
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
	enlaceHistorico?: { carpetaId: number; etiqueta?: string };
}

const EditorListaObjetivos = ({
	modoDia = false,
	fecha = new Date(),
	listaId,
	tipo,
	clavePeriodo,
	titulo,
	enlaceHistorico,
}: Props) => {
	const queryClient = useQueryClient();
	const [nuevoTexto, setNuevoTexto] = useState("");
	const [creando, setCreando] = useState(false);

	const invalidar = () => {
		queryClient.invalidateQueries({ queryKey: queryKeys.objetivosDia });
		queryClient.invalidateQueries({ queryKey: ["objetivos-lista"] });
		queryClient.invalidateQueries({ queryKey: ["objetivos-historico"] });
	};

	const { data, isLoading } = useApiQuery({
		key: modoDia
			? [...queryKeys.objetivosDia, formatearFechaClave(fecha)]
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
		activado: modoDia || !!listaId || (!!tipo && !!clavePeriodo),
	});

	const agregarItem = async (e?: FormEvent) => {
		e?.preventDefault();
		const texto = nuevoTexto.trim();
		if (!texto) return;

		setCreando(true);
		try {
			if (data?.id) {
				await api.itemPOST(crearItemRequest(data.id, texto));
			} else if (tipo && clavePeriodo) {
				await api.itemPOST(
					new CrearItemObjetivoDTO({
						tipo,
						clavePeriodo,
						texto,
					}),
				);
			}
			setNuevoTexto("");
			invalidar();
		} catch {
			toast.error("Error al agregar el objetivo");
		} finally {
			setCreando(false);
		}
	};

	const tituloMostrado =
		titulo ??
		(modoDia
			? tituloPeriodoActual(TipoListaObjetivoEnum._1)
			: tipo
				? tituloPeriodoActual(tipo)
				: "Objetivos");

	const subtitulo =
		modoDia || tipo
			? fecha.toLocaleDateString("es-AR", {
				weekday: "short",
				day: "numeric",
				month: "short",
			})
			: undefined;

	if (isLoading && !data) {
		return (
			<div className='mb-4 pb-3 border-b border-gray-100 animate-pulse'>
				<div className='h-4 bg-gray-100 rounded w-24 mb-3' />
				<div className='h-8 bg-gray-50 rounded mb-2' />
				<div className='h-8 bg-gray-50 rounded' />
			</div>
		);
	}

	const items = data?.items ?? [];

	return (
		<div className='mb-4 pb-4 border-b border-gray-200'>
			<div className='flex items-baseline justify-between mb-2'>
				<div>
					<h2 className='text-sm font-semibold text-gray-800'>{tituloMostrado}</h2>
					{subtitulo && <p className='text-xs text-gray-500'>{subtitulo}</p>}
				</div>
				{enlaceHistorico && (
					<a
						href={`#/${enlaceHistorico.carpetaId}/escritos`}
						className='text-xs text-gray-500 hover:text-gray-700'
					>
						{enlaceHistorico.etiqueta ?? "Ver histórico →"}
					</a>
				)}
			</div>

			{data?.advertenciaLimite && (
				<div className='mb-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded px-2 py-1'>
					{data.advertenciaLimite}
				</div>
			)}

			<div className='space-y-0'>
				{items.map((item) => (
					<ObjetivoItemFila
						key={item.id}
						item={item}
						onActualizado={invalidar}
						onToggle={(id) => api.completado(id).then(() => undefined)}
						onEditar={(id, dto) => api.itemPUT(id, dto).then(() => undefined)}
						onEliminar={(id) => api.itemDELETE(id).then(() => undefined)}
					/>
				))}
			</div>

			<form onSubmit={agregarItem} className='mt-2 flex gap-2'>
				<input
					type='text'
					value={nuevoTexto}
					onChange={(e) => setNuevoTexto(e.target.value)}
					placeholder='Agregar objetivo…'
					disabled={creando}
					className='flex-1 text-sm border border-gray-200 rounded-md px-2 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400'
				/>
			</form>
		</div>
	);
};

export default EditorListaObjetivos;
