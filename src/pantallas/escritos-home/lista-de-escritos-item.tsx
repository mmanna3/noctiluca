import { IEscritoDTO } from "@/api/clients";
import ListaItem from "../../components/lista-item";
import usarNavegacion from "../../usar-navegacion";

const Escrito = (escrito: IEscritoDTO) => {
	const { irAVerEscrito } = usarNavegacion();
	const obtenerResumen = (texto: string) => texto.slice(0, 80) + (texto.length > 80 ? "..." : "");

	return (
		<>
			<ListaItem
				fecha={escrito.fechaHoraCreacion?.toString()}
				titulo={escrito.titulo}
				subtitulo={obtenerResumen(escrito.cuerpo || "")}
				onClick={() => irAVerEscrito(escrito.id?.toString() || "")}
			/>
		</>
	);
};

export default Escrito;
