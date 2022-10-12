import FlechaIzquierda from "@mui/icons-material/ChevronLeft";
import Icono from "@mui/icons-material/AddCircle";
import IconoLogout from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import { auth } from "../../firebase";
import ListaDeCarpetas from "./ListaDeCarpetas";
import usarNavegacion from "../../usarNavegacion";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

const CarpetasHome = () => {

	const {irANuevaCarpeta} = usarNavegacion();

	return (
		<div style={{padding: "1em"}}>
			<Grid container>
				<Grid item xs={12}>
					<Button sx={{textTransform: "none", float: "left", marginTop: "0.5rem" }} variant="outlined">
						/
					</Button>
					<IconButton 
						sx={{float: "right"}} 
						aria-label="agregar"
						color="primary"
						onClick={irANuevaCarpeta}>
						<Icono style={{ height: "3rem", width: "3rem" }} />
					</IconButton>
				</Grid>
			</Grid>
			<ListaDeCarpetas />
			<Button 
				startIcon={<IconoLogout />}
				color="inherit"
				sx={{textTransform: "none", float: "right" }} 
				variant="outlined" 
				onClick={() => {auth.signOut(); localStorage.removeItem("noctiluca.uid");}}>
				Cerrar sesión
			</Button>
		</div>
	);
};

export default CarpetasHome;
