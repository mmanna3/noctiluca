import TextField from "@mui/material/TextField";
import { Button, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { IEscrito } from "./Interfaces";
import { useEffect, useState } from "react";
import { obtenerEscrito } from "./firebase";
import Icono from "@mui/icons-material/ChevronLeft";


const VerEscrito = () => {

	const navigate = useNavigate();
	const { id } = useParams();
	const [escrito, setEscrito] = useState<IEscrito>({titulo:"", cuerpo:"", fechaHora: "", id: ""});

	useEffect(() => {
		const callback = (_escrito: IEscrito) => {
			console.log(_escrito);
			setEscrito(_escrito);
		};

		if (id)
			obtenerEscrito(id, callback);
			
	}, [id]);

	const volverALasNotas = () => {
		navigate("/");
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
			InputProps={{ disableUnderline: true, autoFocus: true, style: { fontSize: "1.5rem" }, readOnly: true }}
			variant="standard"
			placeholder="Título"
			value={escrito.titulo}
		/>
		<TextField			
			id="outlined-multiline-static"
			InputProps={{ disableUnderline: true, readOnly: true }}
			variant="standard"
			placeholder="Texto"
			multiline
			rows={15}
			value={escrito.cuerpo}			
		/>

	</Grid>;
};

export default VerEscrito;
