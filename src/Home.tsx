import Icono from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import Escritos from "./Escritos";
import { useNavigate } from "react-router-dom";

const Home = () => {

	const navigate = useNavigate();

	return (
		<div style={{padding: "1em"}}>
			<Button sx={{float: "right"}} variant="contained" onClick={() => navigate("/nuevo")} endIcon={<Icono />}>
  				Nuevo escrito
			</Button>
			<Escritos />
		</div>
	);
};

export default Home;
