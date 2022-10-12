import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { ICarpeta } from "../../Interfaces";
import { useContext, useEffect } from "react";
import { Contexto } from "../../Contexto";
import rutas from "../../rutas";
import useNavegacion from "../../useNavegacion";

const CarpetaListaItem = (carpeta: ICarpeta) => {
	const { navegarAEscritosHome } = useNavegacion();
	const {carpetaSeleccionada, seleccionarCarpeta} = useContext(Contexto);

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
