import Icono from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import useNavegacion from "../../useNavegacion";
import ListaDeEscritos from "./ListaDeEscritos";
import { useParams } from "react-router-dom";

const Home = () => {

	const {carpetaId} = useParams();
	const {irANuevoEscrito} = useNavegacion();

	return (
		<div style={{padding: "1em"}}>
			<IconButton 
				sx={{float: "right"}} 
				aria-label="agregar"
				color="primary"
				onClick={() => carpetaId && irANuevoEscrito(carpetaId)}>
				<Icono style={{ height: "3rem", width: "3rem" }} />
			</IconButton>
			<ListaDeEscritos />
		</div>
	);
};

export default Home;
