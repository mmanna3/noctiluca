import { ICarpeta } from "../../Interfaces";
import ListaItem from "../../components/listaItem";
import usarNavegacion from "../../usarNavegacion";

const ListaDeCarpetasItem = (carpeta: ICarpeta) => {

	const {verEscritosDeLaCarpeta} = usarNavegacion();

	let texto = "";
	const cantidadDeEscritos = Object.keys(carpeta.escritos).length;
	if (cantidadDeEscritos === 1)
		texto = "1 escrito";
	else
		texto = `${cantidadDeEscritos} escritos`;

	return <ListaItem titulo={carpeta.titulo} subtitulo={texto} onClick={() => verEscritosDeLaCarpeta(carpeta.titulo)}/>;
};

export default ListaDeCarpetasItem;
