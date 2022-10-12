import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { ICarpeta } from "../../Interfaces";
import usarNavegacion from "../../usarNavegacion";

const ListaDeCarpetasItem = (carpeta: ICarpeta) => {

	const {verEscritosDeLaCarpeta} = usarNavegacion();

	return <>
		<ListItem alignItems="flex-start">
			<ListItemText
				primary={carpeta.titulo}
				secondary={`${Object.keys(carpeta.escritos).length} escritos`}
				onClick={() => verEscritosDeLaCarpeta(carpeta.titulo)}
			/>
		</ListItem>
	</>;
};

export default ListaDeCarpetasItem;
