import { useLocation, useNavigate, useParams } from "react-router-dom";

const usarNavegacion = () => {
	const navigate = useNavigate();
	const { carpetaId, id, carpetaTitulo } = useParams();
	const location = useLocation();

	return {
		escritoId: id,
		carpetaId: carpetaId,
		carpetaTitulo: carpetaTitulo,
		irALogin: () => {
			navigate("/login", { replace: true });
		},
		irAlInicio: () => {
			navigate("/", { replace: true });
		},
		verEscritosDeLaCarpeta: (carpetaId: number) => {
			navigate(`/${carpetaId}/escritos`);
		},
		volverAEscritosHome: () => {
			navigate(`/${carpetaId}/escritos`, { replace: true });
		},
		irAVerEscrito: (escritoId: string) => {
			// Detectar si estamos en la papelera
			if (location.pathname.includes("/papelera")) {
				navigate(`/papelera/ver/${escritoId}`);
			} else {
				navigate(`/${carpetaId}/escritos/ver/${escritoId}`);
			}
		},
		volverAPapelera: () => {
			navigate("/papelera", { replace: true });
		},
		irANuevoEscrito: (carpetaTitulo: string) => {
			navigate(`/${carpetaId}/${carpetaTitulo}/nuevo`, { replace: true });
		},
		irANuevaCarpeta: () => {
			navigate("/nueva-carpeta", { replace: true });
		},
		irAPapelera: () => {
			navigate("/papelera", { replace: true });
		},
		irAModoLectura: () => {
			navigate("/modo-lectura", { replace: true });
		},
	};
};

export default usarNavegacion;
