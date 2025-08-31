import { CarpetaDTO } from "@/api/clients";
import CarpetasListaItem from "./lista-de-carpetas-item";

interface IListaDeCarpetas {
	data: CarpetaDTO[];
	isLoading: boolean;
	isError: boolean;
}

function CarpetasLista(props: IListaDeCarpetas) {
	return (
		<div>
			{props.data.map((carpeta: CarpetaDTO) => (
				<CarpetasListaItem {...carpeta} key={carpeta.titulo} />
			))}
		</div>
	);
}

export default CarpetasLista;
