import { useNavigate, useParams } from "react-router-dom";

const usarNavegacion = () => {

	const navigate = useNavigate();
	const { carpetaId, id } = useParams();

	return {
		escritoId: id,
		carpetaId: carpetaId,
		verEscritosDeLaCarpeta: (_carpetaId: string) => {
			navigate(`/${_carpetaId}/escritos`);
		},
		volverAEscritosHome: () => {
			navigate(`/${carpetaId}/escritos`, { replace: true });
		},
		irAVerEscrito: (escritoId: string) => {
			navigate(`ver/${escritoId}`);
		},
		irANuevoEscrito: () => {
			navigate(`/${carpetaId}/nuevo`, { replace: true });
		}
	
	};
};

export default usarNavegacion;