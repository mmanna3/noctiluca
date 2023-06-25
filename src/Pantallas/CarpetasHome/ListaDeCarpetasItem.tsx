import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { ICarpeta } from "../../Interfaces";
import usarNavegacion from "../../usarNavegacion";

const ListaDeCarpetasItem = (carpeta: ICarpeta) => {

	const {verEscritosDeLaCarpeta} = usarNavegacion();

	let texto = "";
	const cantidadDeEscritos = Object.keys(carpeta.escritos).length;
	if (cantidadDeEscritos === 1)
		texto = "1 escrito";
	else
		texto = `${cantidadDeEscritos} escritos`;

	return <>
		<ListItem alignItems="flex-start">
			<ListItemText
				primary={carpeta.titulo}
				secondary={texto}
				onClick={() => verEscritosDeLaCarpeta(carpeta.titulo)}
			/>
		</ListItem>
	</>;
};

export default ListaDeCarpetasItem;
