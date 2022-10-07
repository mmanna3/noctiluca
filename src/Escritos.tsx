import {useEffect, useState} from "react";
import "./App.css";
import Escrito from "./Escrito";
import {escucharEscritos} from "./firebase";

function Escritos() {
	const [escritos, setEscritos] = useState<any[]>([]);

	useEffect(()=> {
		const callback = (_escritos: any) => { 
			console.log(_escritos);
			setEscritos(_escritos);
		};

		escucharEscritos(callback);
	}, []);

	return (
		<div>			
			{Object.keys(escritos).map((escrito: any) => 
				<Escrito key={escrito} {...escritos[escrito]} />
			)}
		</div>
	);
}

export default Escritos;
