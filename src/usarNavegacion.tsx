import { useNavigate, useParams } from "react-router-dom";

const usarNavegacion = () => {
	const navigate = useNavigate();
	const { carpetaId, id, carpetaTitulo } = useParams();

	return {
		escritoId: id,
		carpetaId: carpetaId,
		carpetaTitulo: carpetaTitulo,
		irALogin: () => {
			navigate("/login", { replace: true });
		},
		irACarpetasHome: () => {
			navigate("/", { replace: true });
		},
		verEscritosDeLaCarpeta: (carpetaId: number) => {
			navigate(`/${carpetaId}/escritos`);
		},
		volverAEscritosHome: () => {
			navigate(`/${carpetaId}/escritos`, { replace: true });
		},
		irAVerEscrito: (escritoId: string) => {
			navigate(`ver/${escritoId}`);
		},
		irANuevoEscrito: (carpetaTitulo: string) => {
			navigate(`/${carpetaId}/${carpetaTitulo}/nuevo`, { replace: true });
		},
		irANuevaCarpeta: () => {
			navigate("/nueva-carpeta", { replace: true });
		},
	};
};

export default usarNavegacion;
