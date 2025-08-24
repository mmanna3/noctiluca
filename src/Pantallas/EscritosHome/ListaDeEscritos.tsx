import { NotaDTO } from "@/api/clients";
import { useParams } from "react-router-dom";
import ListaDeEscritosItem from "./ListaDeEscritosItem";

interface IListaDeCarpetas {
	data: NotaDTO[];
	isLoading: boolean;
	isError: boolean;
}

function ListaDeEscritos(props: IListaDeCarpetas) {
	const { carpetaId } = useParams();

	return (
		<div>
			{props.data.map((escrito: NotaDTO) => (
				<ListaDeEscritosItem {...escrito} key={escrito.titulo} />
			))}
		</div>
	);
}

export default ListaDeEscritos;
