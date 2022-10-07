import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Button, Grid } from "@mui/material";
import { crearEscrito } from "./firebase";
import { useNavigate } from "react-router-dom";

const NuevoEscrito = () => {

	const navigate = useNavigate();
	const [titulo, setTitulo] = useState("");
	const [cuerpo, setCuerpo] = useState("");

	return <Grid
		container
		flexDirection="column"
		rowGap="20px"
		padding="1em"
	>
		<TextField
			id="outlined-name"
			label="Título"
			value={titulo}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value)}
		/>
		<TextField
			id="outlined-multiline-static"
			label="Texto"
			multiline
			rows={10}
			value={cuerpo}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCuerpo(e.target.value)}
		/>
		<Button variant="outlined" onClick={() => navigate("/")}>
				Cancelar
		</Button>
		<Button variant="contained" onClick={() => {crearEscrito(titulo, cuerpo); navigate("/");}}>
				Crear escrito
		</Button>
	</Grid>;
};

export default NuevoEscrito;
