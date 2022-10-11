import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { ICarpeta } from "./Interfaces";
import { useContext, useEffect } from "react";
import { Contexto } from "./Contexto";
import { useNavigate } from "react-router-dom";

const CarpetaListaItem = (carpeta: ICarpeta) => {
	const navigate = useNavigate();
	const {carpetaSeleccionada, seleccionarCarpeta} = useContext(Contexto);

	useEffect(() => {
		console.log("seleccionada");
		console.log(carpetaSeleccionada);
	}, [carpetaSeleccionada]);

	const clickEnCarpeta = () => {
		if (seleccionarCarpeta) {
			seleccionarCarpeta(carpeta);
			navigate("/home");
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
