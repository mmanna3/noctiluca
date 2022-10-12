import TextField from "@mui/material/TextField";
import Icono from "@mui/icons-material/ChevronLeft";
import { useState } from "react";
import { Button, Grid } from "@mui/material";
import { crearCarpeta } from "../firebase";
import usarNavegacion from "../usarNavegacion";

const NuevaCarpeta = () => {

	const {irACarpetasHome } = usarNavegacion();
	const [titulo, setTitulo] = useState("");

	const crearYVolver = () => {		
		if (titulo != "")
			crearCarpeta(titulo);
		irACarpetasHome();
	};

	return <Grid
		container
		flexDirection="column"
		rowGap="20px"
		padding="1em"
	>
		<Grid container>
			<Button startIcon={<Icono />} sx={{textTransform: "none" }} variant="outlined" onClick={crearYVolver}>
				Crear carpeta
			</Button>
		</Grid>
		<TextField
			id="outlined-name"
			InputProps={{ autoFocus: true, style: { fontSize: "1.5rem" } }}
			variant="standard"
			placeholder="Título"
			value={titulo}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value)}
		/>
	</Grid>;
};

export default NuevaCarpeta;
