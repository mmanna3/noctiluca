import { useEffect, useState } from "react";
import "./App.css";
import Escrito from "./Escrito";
import { escucharEscritos } from "./firebase";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";

function Escritos() {
	const [escritos, setEscritos] = useState<any[]>([]);

	useEffect(() => {
		const callback = (_escritos: any) => {
			console.log(_escritos);
			setEscritos(_escritos);
		};

		escucharEscritos(callback);
	}, []);

	return (
		<Grid container   
			alignItems="center"
			justifyContent="center">
			<List sx={{ width: "100%", bgcolor: "background.paper" }}>
				{Object.keys(escritos).map((escrito: any) => (
					<Grid item xs={12} key={escrito}>
						<Escrito {...escritos[escrito]} id={escrito} />
						<Divider variant='inset' component='li' />
					</Grid>
				))}
			</List>
		</Grid>
	);
}

export default Escritos;
