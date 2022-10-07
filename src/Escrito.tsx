import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { IEscrito } from "./Interfaces";
import { useNavigate } from "react-router-dom";

interface IEscritoInput extends IEscrito {
	id: string;
}

const Escrito = (escrito: IEscritoInput) => {
	
	const navigate = useNavigate();
	const obtenerResumen = (texto: string) => texto.slice(0, 80) + (texto.length > 80 ? "..." : ""); 

	return <>
		<ListItem alignItems="flex-start">
			<ListItemText
				primary={escrito.titulo}
				secondary={obtenerResumen(escrito.cuerpo)}
				onClick={() => navigate(`/ver/${escrito.id}`)}
			/>
		</ListItem>
	</>;
};

export default Escrito;
