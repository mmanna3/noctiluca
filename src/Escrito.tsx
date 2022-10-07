import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { IEscrito } from "./Interfaces";

const Escrito = (escrito: IEscrito) => {
	// return <div>{escrito.titulo}</div>;
	return <>
		<ListItem alignItems="flex-start">
			<ListItemText
				primary={escrito.titulo}
				secondary={escrito.cuerpo}	  
			/>
		</ListItem>
	</>;
};

export default Escrito;
