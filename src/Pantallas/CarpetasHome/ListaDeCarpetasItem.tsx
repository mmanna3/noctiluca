import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { ICarpeta } from "../../Interfaces";
import useNavegacion from "../../useNavegacion";

const CarpetaListaItem = (carpeta: ICarpeta) => {
	const { seleccionarCarpeta } = useNavegacion();	

	const clickEnCarpeta = () => {		
		seleccionarCarpeta(carpeta);					
	};

	return <>
		<ListItem alignItems="flex-start">
			<ListItemText
				primary={carpeta.titulo}
				secondary={`${Object.keys(carpeta.escritos).length} escritos`}
				onClick={clickEnCarpeta}
			/>
		</ListItem>
	</>;
};

export default CarpetaListaItem;
