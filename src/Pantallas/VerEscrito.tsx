import Icono from "@mui/icons-material/ChevronLeft";
import IconoTacho from "@mui/icons-material/DeleteOutline";
import { Button, Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { editarEscrito, eliminarEscrito, obtenerEscrito } from "../firebase";
import { IEscrito } from "../Interfaces";
import usarNavegacion from "../usarNavegacion";


const VerEscrito = () => {

	const {volverAEscritosHome} = usarNavegacion();
	const { carpetaId, id } = useParams();

	const [titulo, setTitulo] = useState("");
	const [cuerpo, setCuerpo] = useState("");

	useEffect(() => {
		const callback = (_escrito: IEscrito) => {
			console.log(_escrito);
			setTitulo(_escrito.titulo);
			setCuerpo(_escrito.cuerpo);
		};

		if (carpetaId && id)
			obtenerEscrito(carpetaId, id, callback);
			
	}, [id]);

	const volverALasNotas = () => {
		if (carpetaId && id && titulo != "")
			editarEscrito(carpetaId, {id, titulo, cuerpo, fechaHora: ""});
		volverAEscritosHome();
	};

	const eliminar = () => {
		if (carpetaId && id)
			eliminarEscrito(carpetaId, id);
		volverAEscritosHome();
	};

	return <Grid
		container
		flexDirection="column"
		rowGap="20px"
		padding="1em"
	>
		<Grid container>
			<Grid item xs={12}>
				<Button startIcon={<Icono />} sx={{textTransform: "none", float: "left" }} variant="outlined" onClick={volverALasNotas}>
				Ir a las notas
				</Button>
				<IconoTacho 
					sx={{float: "right"}}
					aria-label="agregar"
					color="disabled"
					onClick={() => eliminar()}>
					<Icono style={{ height: "3rem", width: "3rem" }} />
				</IconoTacho>
			</Grid>
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