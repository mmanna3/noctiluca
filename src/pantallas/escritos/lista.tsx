import { EscritoDTO } from "@/api/clients";
import ListaDeEscritosItem from "./lista-item";

interface IListaDeCarpetas {
	data: EscritoDTO[];
	isLoading: boolean;
	isError: boolean;
}

function ListaDeEscritos(props: IListaDeCarpetas) {
	return (
		<div>
			{props.data.map((escrito: EscritoDTO) => (
				<ListaDeEscritosItem {...escrito} key={escrito.titulo} />
			))}
		</div>
	);
}

export default ListaDeEscritos;
