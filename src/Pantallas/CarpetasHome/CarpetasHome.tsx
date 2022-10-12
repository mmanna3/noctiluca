import Icono from "@mui/icons-material/AddCircle";
import IconoLogout from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { auth } from "../../firebase";
import ListaDeCarpetas from "./ListaDeCarpetas";

const Home = () => {

	const navigate = useNavigate();

	return (
		<div style={{padding: "1em"}}>
			<IconButton 
				sx={{float: "left"}} 
				aria-label="agregar"
				onClick={() => {auth.signOut(); localStorage.removeItem("noctiluca.uid");}}>
				<IconoLogout sx={{transform: "scaleX(-1)"}} />
			</IconButton>
			<IconButton 
				sx={{float: "right"}} 
				aria-label="agregar"
				color="primary"
				onClick={() => navigate("/nuevo")}>
				<Icono style={{ height: "3rem", width: "3rem" }} />
			</IconButton>
			<ListaDeCarpetas />
		</div>
	);
};

export default Home;