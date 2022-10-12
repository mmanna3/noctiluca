import Icono from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import ListaDeEscritos from "./ListaDeEscritos";

const Home = () => {

	const navigate = useNavigate();

	return (
		<div style={{padding: "1em"}}>
			<IconButton 
				sx={{float: "right"}} 
				aria-label="agregar"
				color="primary"
				onClick={() => navigate("/nuevo")}>
				<Icono style={{ height: "3rem", width: "3rem" }} />
			</IconButton>
			<ListaDeEscritos />
		</div>
	);
};

export default Home;
