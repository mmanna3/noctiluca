import { NotaDTO } from "@/api/clients";
import ListaDeEscritosItem from "./ListaDeEscritosItem";

interface IListaDeCarpetas {
	data: NotaDTO[];
	isLoading: boolean;
	isError: boolean;
}

function ListaDeEscritos(props: IListaDeCarpetas) {
	return (
		<div>
			{props.data.map((escrito: NotaDTO) => (
				<ListaDeEscritosItem {...escrito} key={escrito.titulo} />
			))}
		</div>
	);
}

export default ListaDeEscritos;
