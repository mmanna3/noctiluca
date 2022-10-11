import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { ICarpeta } from "./Interfaces";
import { useNavigate } from "react-router-dom";

const CarpetaListaItem = (carpeta: ICarpeta) => {
	
	const navigate = useNavigate();

	return <>
		<ListItem alignItems="flex-start">
			<ListItemText
				primary={carpeta.titulo}
				secondary={`${Object.keys(carpeta.escritos).length} escritos`}
				// onClick={() => navigate(`/ver/${escrito.id}`)}
			/>
		</ListItem>
	</>;
};

export default CarpetaListaItem;
