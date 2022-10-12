import Escrito from "./ListaDeEscritosItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { usarContexto } from "../../Contexto";
import { useEffect, useState } from "react";

function Escritos() {
	const [escritos, setEscritos] = useState<any>([]);
	const {carpetaSeleccionada} = usarContexto();

	useEffect(() => {
		console.log(carpetaSeleccionada);
		setEscritos(carpetaSeleccionada.escritos);
	}, [carpetaSeleccionada]);

	return (
		<Grid container   
			alignItems="center"
			justifyContent="center">
			<List sx={{ width: "100%", bgcolor: "background.paper" }}>
				{Object.keys(escritos).length && Object.keys(escritos).map((clave: string) => (
					<Grid item xs={12} key={clave}>
						<Escrito {...escritos[clave]} />
						<Divider variant='inset' component='li' />
					</Grid>
				))}
			</List>
		</Grid>
	);
}

export default Escritos;
