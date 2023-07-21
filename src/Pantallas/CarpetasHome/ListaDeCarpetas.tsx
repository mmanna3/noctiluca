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
			{carpetas.map((carpeta: ICarpeta) =>
				<CarpetasListaItem {...carpeta} key={carpeta.titulo}/>
			)}
		</div>
	);
}

export default CarpetasLista;
