import { useEffect, useState } from "react";
import ListaDeEscritosItem from "./ListaDeEscritosItem";
import { escucharEscritos } from "../../firebase";
import { IEscrito } from "../../Interfaces";
import { useParams } from "react-router-dom";


function ListaDeEscritos() {
	const [escritos, setEscritos] = useState<IEscrito[]>([]);
	const { carpetaId } = useParams();

	useEffect(() => {
		const callback = (_escritos: IEscrito[]) => {
			console.log(carpetaId);
			console.table(_escritos);
			setEscritos(_escritos);
		};

		if (carpetaId)
			escucharEscritos(carpetaId, callback);
	}, []);

	return (
		<div>
			{escritos.map((escrito: IEscrito) =>
				<ListaDeEscritosItem {...escrito} key={escrito.titulo}/>
			)}
		</div>
	);
}

export default ListaDeEscritos;