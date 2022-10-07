import TextField from "@mui/material/TextField";
import { Button, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { IEscrito } from "./Interfaces";
import { useEffect, useState } from "react";
import { obtenerEscrito } from "./firebase";


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

	return <Grid
		container
		flexDirection="column"
		rowGap="20px"
		padding="1em"
	>
		<TextField
			id="outlined-name"
			label="Título"
			value={escrito.titulo}
		/>
		<TextField
			id="outlined-multiline-static"
			label="Texto"
			multiline
			rows={10}
			value={escrito.cuerpo}
		/>
		<Button variant="outlined" onClick={() => navigate("/")}>
				Volver
		</Button>
	</Grid>;
};

export default VerEscrito;
