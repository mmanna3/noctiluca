import TextField from "@mui/material/TextField";
import Icono from "@mui/icons-material/ChevronLeft";
import { useState } from "react";
import { Button, Grid } from "@mui/material";
import { crearEscrito } from "./firebase";
import { useNavigate } from "react-router-dom";

const NuevoEscrito = () => {

	const navigate = useNavigate();
	const [titulo, setTitulo] = useState("");
	const [cuerpo, setCuerpo] = useState("");

	const volverALasNotas = () => {
		if (titulo != "")
			crearEscrito(titulo, cuerpo);
		navigate("/home");
	};

	return <Grid
		container
		flexDirection="column"
		rowGap="20px"
		padding="1em"
	>
		<Grid container>
			<Button startIcon={<Icono />} sx={{textTransform: "none" }} variant="outlined" onClick={volverALasNotas}>
				Ir a las notas
			</Button>
		</Grid>
		<TextField
			id="outlined-name"
			InputProps={{ disableUnderline: true, autoFocus: true, style: { fontSize: "1.5rem" } }}
			variant="standard"
			placeholder="Título"
			value={titulo}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value)}
		/>
		<TextField			
			id="outlined-multiline-static"
			InputProps={{ disableUnderline: true }}
			variant="standard"
			placeholder="Texto"
			multiline
			rows={15}
			value={cuerpo}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCuerpo(e.target.value)}
		/>

	</Grid>;
};

export default NuevoEscrito;
