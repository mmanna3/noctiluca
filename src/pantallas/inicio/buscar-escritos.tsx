import { api } from "@/api/api";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { queryKeys } from "@/api/query-keys";
import { useEffect, useState } from "react";
import Input from "../../components/ui/input";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import ListaDeEscritos from "../escritos/lista";

const MINIMO_CARACTERES = 3;
const DEBOUNCE_MS = 300;

interface Props {
	abierto: boolean;
}

const BuscarEscritos = ({ abierto }: Props) => {
	const [textoBusqueda, setTextoBusqueda] = useState("");
	const [textoDebounced, setTextoDebounced] = useState("");

	useEffect(() => {
		if (!abierto) {
			setTextoBusqueda("");
			setTextoDebounced("");
		}
	}, [abierto]);

	useEffect(() => {
		const timer = setTimeout(() => setTextoDebounced(textoBusqueda.trim()), DEBOUNCE_MS);
		return () => clearTimeout(timer);
	}, [textoBusqueda]);

	const busquedaActiva = textoDebounced.length >= MINIMO_CARACTERES;

	const { data, isLoading, isError } = useApiQuery({
		key: queryKeys.buscarEscritos(textoDebounced),
		fn: async () => await api.buscar(textoDebounced),
		activado: abierto && busquedaActiva,
	});

	if (!abierto) return null;

	return (
		<div className='mb-4'>
			<Input
				valor={textoBusqueda}
				autoFocus
				sinBorde
				cuandoCambie={(e) => setTextoBusqueda(e.target.value)}
			/>

			{busquedaActiva && (
				<div className='mt-2'>
					{isLoading && (
						<div className='flex justify-center py-4'>
							<LoadingSpinner />
						</div>
					)}
					{isError && <p className='px-2 py-3 text-sm text-red-600'>Error al buscar</p>}
					{!isLoading && !isError && data && data.length === 0 && (
						<p className='px-2 py-3 text-sm text-gray-500'>Sin resultados</p>
					)}
					{!isLoading && !isError && data && data.length > 0 && (
						<ListaDeEscritos data={data} isLoading={false} isError={false} mostrarCarpeta />
					)}
				</div>
			)}
		</div>
	);
};

export default BuscarEscritos;
