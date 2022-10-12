import Icono from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import usarNavegacion from "../../usarNavegacion";
import ListaDeEscritos from "./ListaDeEscritos";

const Home = () => {

	const {irANuevoEscrito} = usarNavegacion();

	return (
		<div style={{padding: "1em"}}>
			<IconButton 
				sx={{float: "right"}} 
				aria-label="agregar"
				color="primary"
				onClick={irANuevoEscrito}>
				<Icono style={{ height: "3rem", width: "3rem" }} />
			</IconButton>
			<ListaDeEscritos />
		</div>
	);
};

export default Home;
