import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useEffect } from "react";
import { usarContexto } from "../../Contexto";
import { ICarpeta } from "../../Interfaces";
import useNavegacion from "../../useNavegacion";

const CarpetaListaItem = (carpeta: ICarpeta) => {
	const { navegarAEscritosHome } = useNavegacion();
	const {carpetaSeleccionada, seleccionarCarpeta} = usarContexto();

	useEffect(() => {
		console.log("seleccionada");
		console.log(carpetaSeleccionada);
	}, [carpetaSeleccionada]);

	const clickEnCarpeta = () => {
		if (seleccionarCarpeta) {
			seleccionarCarpeta(carpeta);
			navegarAEscritosHome(carpeta.titulo);
		}			
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
