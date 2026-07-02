import { MINIMO_CARACTERES_BUSQUEDA } from "@/sync/busqueda-core";
import { usarBusquedaEscritos } from "@/sync/busqueda";
import { useEstadoSync } from "@/sync/estado-sync";
import { useEffect, useState } from "react";
import Input from "../../components/ui/input";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import ListaDeEscritos from "../escritos/lista";

const DEBOUNCE_MS = 300;

interface Props {
	abierto: boolean;
}

const BuscarEscritos = ({ abierto }: Props) => {
	const [textoBusqueda, setTextoBusqueda] = useState("");
	const [textoDebounced, setTextoDebounced] = useState("");
	const online = useEstadoSync((s) => s.online);

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

	const busquedaActiva = textoDebounced.length >= MINIMO_CARACTERES_BUSQUEDA;
	const resultados = usarBusquedaEscritos(busquedaActiva ? textoDebounced : "");
	const isLoading = busquedaActiva && resultados === undefined;

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
					{!online && (
						<p className='px-2 pb-2 text-xs text-amber-700'>
							Sin conexión — buscando en tus escritos sincronizados
						</p>
					)}
					{isLoading && (
						<div className='flex justify-center py-4'>
							<LoadingSpinner />
						</div>
					)}
					{!isLoading && resultados && resultados.length === 0 && (
						<p className='px-2 py-3 text-sm text-gray-500'>Sin resultados</p>
					)}
					{!isLoading && resultados && resultados.length > 0 && (
						<ListaDeEscritos data={resultados} isLoading={false} isError={false} mostrarCarpeta />
					)}
				</div>
			)}
		</div>
	);
};

export default BuscarEscritos;
