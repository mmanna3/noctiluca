import { INotaDTO } from "@/api/clients";
import ListaItem from "../../components/listaItem";
import usarNavegacion from "../../usarNavegacion";

const Escrito = (escrito: INotaDTO) => {
	const { irAVerEscrito } = usarNavegacion();
	const obtenerResumen = (texto: string) => texto.slice(0, 80) + (texto.length > 80 ? "..." : "");

	return (
		<>
			<ListaItem
				fecha={escrito.fechaHora?.toString()}
				titulo={escrito.titulo}
				subtitulo={obtenerResumen(escrito.cuerpo || "")}
				onClick={() => irAVerEscrito(escrito.id?.toString() || "")}
			/>
		</>
	);
};

export default Escrito;
