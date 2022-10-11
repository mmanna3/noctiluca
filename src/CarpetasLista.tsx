import { useEffect, useState } from "react";
import "./App.css";
import { escucharCarpetas } from "./firebase";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { ICarpeta } from "./Interfaces";
import CarpetasListaItem from "./CarpetaListaItem";

function CarpetasLista() {
	const [carpetas, setCarpetas] = useState<ICarpeta[]>([]);

	useEffect(() => {
		const callbackCarpetas = (_carpetas: ICarpeta[]) => {
			console.log(_carpetas);
			setCarpetas(_carpetas);
		};

		escucharCarpetas(callbackCarpetas);
	}, []);

	return (
		<Grid container   
			alignItems="center"
			justifyContent="center">
			<List sx={{ width: "100%", bgcolor: "background.paper" }}>
				{carpetas.map((carpeta: ICarpeta) => (
					<Grid item xs={12} key={carpeta.titulo}>
						<CarpetasListaItem {...carpeta}/>
						<Divider variant='inset' component='li' />
					</Grid>
				))}
			</List>
		</Grid>
	);
}

export default CarpetasLista;
