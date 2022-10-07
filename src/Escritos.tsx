import { useEffect, useState } from "react";
import "./App.css";
import Escrito from "./Escrito";
import { escucharEscritos } from "./firebase";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";

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
		<List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
			{Object.keys(escritos).map((escrito: any) => (
				<>
					<Escrito key={escrito} {...escritos[escrito]} />
					<Divider variant='inset' component='li' />
				</>
			))}
		</List>
	);
}

export default Escritos;
