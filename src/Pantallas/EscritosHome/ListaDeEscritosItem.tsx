import { IEscrito } from "../../Interfaces";
import usarNavegacion from "../../usarNavegacion";
import ListaItem from "../../components/listaItem";

interface IEscritoInput extends IEscrito {
	id: string;
}

const Escrito = (escrito: IEscritoInput) => {
	
	const { irAVerEscrito } = usarNavegacion();
	const obtenerResumen = (texto: string) => texto.slice(0, 80) + (texto.length > 80 ? "..." : ""); 

	return <>
		<ListaItem titulo={escrito.titulo} subtitulo={obtenerResumen(escrito.cuerpo)} onClick={() => irAVerEscrito(escrito.id)}/>
	</>;
};

export default Escrito;
