import { api } from "@/api/api";
import { HistoricoObjetivoDTO, TipoListaObjetivoEnum } from "@/api/clients";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { queryKeys } from "@/api/query-keys";
import ListaItem from "@/components/ui/lista-item";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import usarNavegacion from "@/usar-navegacion";
import { etiquetaPeriodo } from "./utilidades-objetivos";

interface Props {
	tipo: TipoListaObjetivoEnum;
	carpetaId: number;
}

const HistoricoObjetivos = ({ tipo, carpetaId }: Props) => {
	const { irAListaObjetivos } = usarNavegacion();

	const { data, isLoading, isError } = useApiQuery({
		key: [...queryKeys.objetivosHistorico(tipo), 1],
		fn: () => api.historico(tipo, 1, 50),
	});

	if (isLoading) {
		return (
			<div className='flex justify-center py-8'>
				<LoadingSpinner />
			</div>
		);
	}

	if (isError) {
		return <p className='text-sm text-red-500 py-4'>Error al cargar el histórico</p>;
	}

	const items = data?.items ?? [];

	if (items.length === 0) {
		return (
			<p className='text-sm text-gray-500 py-4 text-center'>
				Todavía no hay listas con objetivos en este período.
			</p>
		);
	}

	const subtitulo = (item: HistoricoObjetivoDTO) =>
		`${item.cantidadCompletados ?? 0}/${item.cantidadItems ?? 0} completados`;

	return (
		<div className='space-y-0'>
			{items.map((item) => (
				<ListaItem
					key={item.id}
					titulo={etiquetaPeriodo(
						item.tipo ?? tipo,
						item.clavePeriodo ?? "",
						item.fechaInicio,
						item.fechaFin,
					)}
					subtitulo={subtitulo(item)}
					onClick={() => item.id && irAListaObjetivos(carpetaId, item.id)}
				/>
			))}
		</div>
	);
};

export default HistoricoObjetivos;
