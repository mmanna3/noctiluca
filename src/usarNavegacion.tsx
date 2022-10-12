import { useNavigate, useParams } from "react-router-dom";
import { usarContexto } from "./Contexto";
import { ICarpeta } from "./Interfaces";

const usarNavegacion = () => {

	const navigate = useNavigate();
	const { carpetaId, id } = useParams();
	const {seleccionarCarpeta} = usarContexto();

	return {
		escritoId: id,
		carpetaId: carpetaId,
		volverAEscritosHome: () => {
			navigate(`/${carpetaId}/escritos`, { replace: true });
		},
		seleccionarCarpeta: (carpeta: ICarpeta) => {
			if (seleccionarCarpeta)
				seleccionarCarpeta(carpeta);
			navigate(`${carpeta.titulo}/escritos`);
		},
		irAVerEscrito: (escritoId: string) => {
			navigate(`ver/${escritoId}`);
		},
		irANuevoEscrito: (carpetaId: string) => {
			navigate(`/${carpetaId}/nuevo`, { replace: true });
		}
	
	};
};

export default usarNavegacion;