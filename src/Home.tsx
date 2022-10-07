import Icono from "@mui/icons-material/AddCircle";
import Escritos from "./Escritos";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";

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
			<Escritos />
		</div>
	);
};

export default Home;
