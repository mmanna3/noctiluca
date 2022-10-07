import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { IEscrito } from "./Interfaces";

const Escrito = (escrito: IEscrito) => {
	
	const obtenerResumen = (texto: string) => texto.slice(0, 50) + "..."; 

	return <>
		<ListItem alignItems="flex-start">
			<ListItemText
				primary={escrito.titulo}
				secondary={obtenerResumen(escrito.cuerpo)}	  
			/>
		</ListItem>
	</>;
};

export default Escrito;
