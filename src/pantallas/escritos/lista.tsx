import { EscritoDTO } from "@/api/clients";
import ListaDeEscritosItem from "./lista-item";

interface Props {
	data: EscritoDTO[];
	isLoading: boolean;
	isError: boolean;
	modoSeleccion?: boolean;
	mostrarCarpeta?: boolean;
	escritosSeleccionados?: Set<number>;
	onToggleSeleccion?: (id: number) => void;
	onLongPress?: (id: number) => void;
}

function ListaDeEscritos(props: Props) {
	return (
		<div>
			{props.data.map((escrito: EscritoDTO) => (
				<ListaDeEscritosItem
					{...escrito}
					key={escrito.id ?? escrito.titulo}
					modoSeleccion={props.modoSeleccion}
					mostrarCarpeta={props.mostrarCarpeta}
					seleccionado={escrito.id ? props.escritosSeleccionados?.has(escrito.id) : false}
					onToggleSeleccion={props.onToggleSeleccion}
					onLongPress={props.onLongPress}
				/>
			))}
		</div>
	);
}

export default ListaDeEscritos;
