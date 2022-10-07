import NoteAdd from "@mui/icons-material/NoteAdd";
import IconButton from "@mui/material/IconButton";
import "./App.css";
import Escritos from "./Escritos";
import { crearEscrito } from "./firebase";

const App = () => {
	return (
		<div className='App'>
			<IconButton color='primary' aria-label='upload picture' component='label'>
				<input hidden accept='image/*' type='file' />
				<NoteAdd />
			</IconButton>
			<Escritos />
			<button onClick={() => crearEscrito("Che che che", "bla sa dlba cuerpito eas das as ")}>
				Crear escrito
			</button>
		</div>
	);
};

export default App;
