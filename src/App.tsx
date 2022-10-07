import {useEffect, useState} from "react";
import "./App.css";
import {crearEscrito, escucharEscritos} from "./firebase";
import IconButton from "@mui/material/IconButton";
import NoteAdd from "@mui/icons-material/NoteAdd";

function App() {
	const [escritos, setEscritos] = useState<any[]>([]);

	useEffect(()=> {
		const callback = (_escritos: any) => { 
			console.log(_escritos);
			setEscritos(_escritos);
		};

		escucharEscritos(callback);
	}, []);

	return (
		<div className="App">
			<IconButton color="primary" aria-label="upload picture" component="label">
				<input hidden accept="image/*" type="file" />
				<NoteAdd />
			</IconButton>
			{Object.keys(escritos).map((escrito: any) => <div key={escrito}>{escritos[escrito].titulo}</div>)}
			<button onClick={() => crearEscrito("Che che che", "bla sa dlba cuerpito eas das as ")}>Crear escrito</button>
		</div>
	);
}

export default App;
