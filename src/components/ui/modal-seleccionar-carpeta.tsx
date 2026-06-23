import { api } from "@/api/api";
import { CarpetaDTO, MoverEscritosDTO } from "@/api/clients";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { clavesCarpetas, clavesEscritos, queryKeys } from "@/api/query-keys";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Boton } from "./botones";
import { LoadingSpinner } from "./loading-spinner";

interface Props {
	escritoIds: number[];
	carpetaActualId: number;
	onCerrar: () => void;
	onMovido: () => void;
}

interface CarpetaDestino {
	carpeta: CarpetaDTO;
	esSubcarpeta: boolean;
}

const obtenerCarpetasDestino = (
	carpetas: CarpetaDTO[],
	carpetaActualId: number,
): CarpetaDestino[] => {
	const destinos: CarpetaDestino[] = [];

	for (const carpeta of carpetas) {
		if (carpeta.id !== undefined && carpeta.id !== carpetaActualId) {
			destinos.push({ carpeta, esSubcarpeta: false });
		}

		for (const subcarpeta of carpeta.subCarpetas || []) {
			if (subcarpeta.id !== undefined && subcarpeta.id !== carpetaActualId) {
				destinos.push({ carpeta: subcarpeta, esSubcarpeta: true });
			}
		}
	}

	return destinos;
};

const ModalSeleccionarCarpeta = ({ escritoIds, carpetaActualId, onCerrar, onMovido }: Props) => {
	const [moviendo, setMoviendo] = useState(false);
	const queryClient = useQueryClient();

	const { data: carpetas, isLoading } = useApiQuery({
		key: queryKeys.carpetasParaMover,
		fn: async () => await api.carpetaAll(),
	});

	const carpetasDestino = obtenerCarpetasDestino(carpetas || [], carpetaActualId);

	const moverACarpeta = async (carpetaDestinoId: number) => {
		setMoviendo(true);
		try {
			await api.mover(
				new MoverEscritosDTO({
					escritoIds,
					carpetaDestinoId,
				}),
			);
			await Promise.all(
				[...clavesCarpetas, ...clavesEscritos].map((queryKey) =>
					queryClient.invalidateQueries({ queryKey }),
				),
			);
			const cantidad = escritoIds.length;
			toast.success(
				cantidad === 1 ? "Escrito movido" : `${cantidad} escritos movidos`,
			);
			onMovido();
		} catch {
			toast.error("Error al mover");
		} finally {
			setMoviendo(false);
		}
	};

	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
			onClick={onCerrar}
		>
			<div
				className='bg-white rounded-lg p-4 w-80 max-h-96 overflow-y-auto'
				onClick={(e) => e.stopPropagation()}
			>
				<div className='flex justify-between items-center mb-4'>
					<h3 className='text-lg font-semibold'>Mover a carpeta</h3>
					<Boton sinBorde onClick={onCerrar}>
						<XMarkIcon className='h-5 w-5' />
					</Boton>
				</div>
				{isLoading ? (
					<div className='flex justify-center py-4'>
						<LoadingSpinner />
					</div>
				) : (
					<div className='space-y-1'>
						{carpetasDestino.map(({ carpeta, esSubcarpeta }) => (
							<button
								key={carpeta.id}
								className={`w-full text-left px-3 py-2 rounded hover:bg-yellow-200 text-sm disabled:opacity-50 ${
									esSubcarpeta ? "pl-6 text-gray-700" : ""
								}`}
								onClick={() => carpeta.id && moverACarpeta(carpeta.id)}
								disabled={moviendo}
							>
								{carpeta.titulo}
							</button>
						))}
						{carpetasDestino.length === 0 && (
							<p className='text-sm text-gray-500 text-center py-2'>
								No hay otras carpetas disponibles
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ModalSeleccionarCarpeta;
