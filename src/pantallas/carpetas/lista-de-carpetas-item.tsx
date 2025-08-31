import { ICarpetaDTO } from "@/api/clients";
import ListaItem from "../../components/ui/lista-item";
import usarNavegacion from "../../usar-navegacion";

const ListaDeCarpetasItem = (carpeta: ICarpetaDTO) => {
	const { verEscritosDeLaCarpeta } = usarNavegacion();

	const cantidadDeEscritos = carpeta.cantidadDeEscritos;
	let texto = "";
	if (cantidadDeEscritos === 1) texto = "1 escrito";
	else texto = `${cantidadDeEscritos} escritos`;

	return (
		<ListaItem
			titulo={carpeta.titulo}
			subtitulo={texto}
			onClick={() => carpeta.id && verEscritosDeLaCarpeta(carpeta.id)}
		/>
	);
};

export default ListaDeCarpetasItem;
