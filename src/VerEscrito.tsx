import TextField from "@mui/material/TextField";
import { Button, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { IEscrito } from "./Interfaces";
import { useEffect, useState } from "react";
import { editarEscrito, obtenerEscrito } from "./firebase";
import Icono from "@mui/icons-material/ChevronLeft";


const VerEscrito = () => {

	const navigate = useNavigate();
	const { id } = useParams();

	const [titulo, setTitulo] = useState("");
	const [cuerpo, setCuerpo] = useState("");

	useEffect(() => {
		const callback = (_escrito: IEscrito) => {
			console.log(_escrito);
			setTitulo(_escrito.titulo);
			setCuerpo(_escrito.cuerpo);
		};

		if (id)
			obtenerEscrito(id, callback);
			
	}, [id]);

	const volverALasNotas = () => {
		if (id && titulo != "")
			editarEscrito({id, titulo, cuerpo, fechaHora: ""});
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
			InputProps={{ disableUnderline: true, style: { fontSize: "1.5rem" } }}
			variant="standard"
			placeholder="Título"
			value={titulo}
			// onClick={() => setEdicionTitulo((prev) => !prev)}
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
			// onClick={() => setEdicionCuerpo((prev) => !prev)}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCuerpo(e.target.value)}
		/>

	</Grid>;
};

export default VerEscrito;
