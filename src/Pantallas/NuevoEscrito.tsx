import TextField from "@mui/material/TextField";
import Icono from "@mui/icons-material/ChevronLeft";
import { useState } from "react";
import { Button, Grid } from "@mui/material";
import { crearEscrito } from "../firebase";
import usarNavegacion from "../usarNavegacion";

const NuevoEscrito = () => {

	const {volverAEscritosHome, carpetaId } = usarNavegacion();
	const [titulo, setTitulo] = useState("");
	const [cuerpo, setCuerpo] = useState("");
	const [errorTitulo, setErrorTitulo] = useState("");

	const crearYVolver = async () => {
		if (titulo === "")
			volverAEscritosHome();
		
		if (carpetaId) {
			const error = await crearEscrito(carpetaId, titulo, cuerpo);
			setErrorTitulo(error);
			if (error === "")
				volverAEscritosHome();
		}
	};

	const cuandoCambieElTitulo = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitulo(e.target.value);
		setErrorTitulo("");
	};

	return <Grid
		container
		flexDirection="column"
		rowGap="20px"
		padding="1em"
	>
		<Grid container>
			<Button startIcon={<Icono />} sx={{textTransform: "none" }} variant="outlined" onClick={crearYVolver}>
				Crear en /{carpetaId}
			</Button>
		</Grid>
		<TextField
			id="outlined-name"
			InputProps={{ disableUnderline: true, autoFocus: true, style: { fontSize: "1.5rem" } }}
			variant="standard"
			placeholder="Título"
			value={titulo}
			onChange={cuandoCambieElTitulo}
			error={errorTitulo.length > 0}
			helperText={errorTitulo}
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
