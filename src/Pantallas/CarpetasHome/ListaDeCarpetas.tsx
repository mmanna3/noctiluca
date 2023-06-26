import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import { useEffect, useState } from "react";
import CarpetasListaItem from "./ListaDeCarpetasItem";
import { escucharCarpetas } from "../../firebase";
import { ICarpeta } from "../../Interfaces";

function CarpetasLista() {
	const [carpetas, setCarpetas] = useState<ICarpeta[]>([]);

	useEffect(() => {
		const callbackCarpetas = (_carpetas: ICarpeta[]) => {
			console.log(_carpetas);
			setCarpetas(_carpetas);
		};

		escucharCarpetas(callbackCarpetas);
	}, []);

	return (
		<div>
			{carpetas.map((carpeta: ICarpeta) => (
				<div className="border-b" key={carpeta.titulo}>
					<CarpetasListaItem {...carpeta}/>
				</div>
			))}
		</div>
	);
}

export default CarpetasLista;
