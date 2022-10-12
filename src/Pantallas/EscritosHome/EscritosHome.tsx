import FlechaIzquierda from "@mui/icons-material/ChevronLeft";
import Icono from "@mui/icons-material/AddCircle";
import { Button, Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import usarNavegacion from "../../usarNavegacion";
import ListaDeEscritos from "./ListaDeEscritos";

const Home = () => {

	const {irACarpetasHome, irANuevoEscrito, carpetaId} = usarNavegacion();

	return (
		<div style={{padding: "1em"}}>
			<Grid container>
				<Grid item xs={12}>
					<Button style={{ marginTop: "0.5rem" }} startIcon={<FlechaIzquierda />} sx={{textTransform: "none", float: "left" }} variant="outlined" onClick={irACarpetasHome}>
						/{carpetaId}
					</Button>
					<IconButton 
						sx={{float: "right"}} 
						aria-label="agregar"
						color="primary"
						onClick={irANuevoEscrito}>
						<Icono style={{ height: "3rem", width: "3rem" }} />
					</IconButton>
				</Grid>
			</Grid>
			<ListaDeEscritos />
		</div>
	);
};

export default Home;
