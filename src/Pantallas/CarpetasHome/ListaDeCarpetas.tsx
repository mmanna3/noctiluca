import { CarpetaDTO } from "@/api/clients";
import { useState } from "react";
import { ICarpeta } from "../../Interfaces";
import CarpetasListaItem from "./ListaDeCarpetasItem";

interface IListaDeCarpetas {
	data: CarpetaDTO[];
	isLoading: boolean;
	isError: boolean;
}

function CarpetasLista(props: IListaDeCarpetas) {
	const [carpetas, setCarpetas] = useState<ICarpeta[]>([]);

	return (
		<div>
			{props.data.map((carpeta: CarpetaDTO) => (
				<CarpetasListaItem {...carpeta} key={carpeta.titulo} />
			))}
		</div>
	);
}

export default CarpetasLista;
