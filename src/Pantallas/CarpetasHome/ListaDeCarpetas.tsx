import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import { useEffect, useState } from "react";
import CarpetasListaItem from "./ListaDeCarpetasItem";
import { escucharCarpetas } from "../../firebase";
import { ICarpeta } from "../../Interfaces";

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
