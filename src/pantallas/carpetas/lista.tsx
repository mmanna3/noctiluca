import { CarpetaDTO } from "@/api/clients";
import ListaDeCarpetasItem from "./lista-item";

interface IListaDeCarpetas {
	data: CarpetaDTO[];
	isLoading: boolean;
	isError: boolean;
}

function CarpetasLista(props: IListaDeCarpetas) {
	return (
		<div>
			{props.data.map((carpeta: CarpetaDTO) => (
				<ListaDeCarpetasItem {...carpeta} key={carpeta.titulo} />
			))}
		</div>
	);
}

export default CarpetasLista;
