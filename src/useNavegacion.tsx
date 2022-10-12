import { useNavigate } from "react-router-dom";
import { usarContexto } from "./Contexto";
import { ICarpeta } from "./Interfaces";

const useNavegacion = () => {

	const navigate = useNavigate();
	const {carpetaSeleccionada, seleccionarCarpeta} = usarContexto();

	return {
		volverAEscritosHome: () => {
			navigate(`/${carpetaSeleccionada.titulo}/escritos`, { replace: true });
		},
		seleccionarCarpeta: (carpeta: ICarpeta) => {
			if (seleccionarCarpeta)
				seleccionarCarpeta(carpeta);
			navigate(`${carpeta.titulo}/escritos`);
		},
		irAVerEscrito: (escritoId: string) => {
			navigate(`ver/${escritoId}`);
		}
	};
};

export default useNavegacion;