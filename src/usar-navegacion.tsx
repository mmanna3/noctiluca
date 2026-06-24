import { useLocation, useNavigate, useParams } from "react-router-dom";

const usarNavegacion = () => {
	const navigate = useNavigate();
	const { carpetaId, id, listaId } = useParams();
	const location = useLocation();

	return {
		escritoId: id,
		carpetaId: carpetaId,
		listaId,
		irALogin: () => {
			navigate("/login", { replace: true });
		},
		irAlInicio: () => {
			navigate("/", { replace: true });
		},
		verEscritosDeLaCarpeta: (carpetaId: number) => {
			navigate(`/${carpetaId}/escritos`);
		},
		volverAEscritosHome: (carpetaIdDestino?: string | number) => {
			const idCarpeta = carpetaIdDestino ?? carpetaId;
			navigate(`/${idCarpeta}/escritos`, { replace: true });
		},
		irAVerEscrito: (escritoId: string, carpetaIdOverride?: string | number) => {
			const idCarpeta = carpetaIdOverride ?? carpetaId;
			if (location.pathname.includes("/papelera")) {
				navigate(`/papelera/ver/${escritoId}`);
			} else {
				navigate(`/${idCarpeta}/escritos/ver/${escritoId}`);
			}
		},
		volverAPapelera: () => {
			navigate("/papelera", { replace: true });
		},
		irANuevoEscrito: (carpetaIdDestino?: string | number) => {
			const idCarpeta = carpetaIdDestino ?? carpetaId;
			navigate(`/${idCarpeta}/nuevo`, { replace: true });
		},
		irACarpeta: (carpetaId: number) => {
			navigate(`/${carpetaId}/escritos`);
		},
		irANuevaCarpeta: () => {
			navigate("/nueva-carpeta", { replace: true });
		},
		irANuevaSubcarpeta: () => {
			navigate(`/${carpetaId}/nueva-subcarpeta`, { replace: true });
		},
		irAPapelera: () => {
			navigate("/papelera", { replace: true });
		},
		irAModoLectura: () => {
			navigate("/modo-lectura", { replace: true });
		},
		irAHabitos: () => {
			navigate("/habitos", { replace: true });
		},
		irAResumenHabitos: () => {
			navigate("/resumen-habitos", { replace: true });
		},
		irAListaObjetivos: (carpetaIdDestino: number, listaIdDestino: number) => {
			navigate(`/${carpetaIdDestino}/lista-objetivos/${listaIdDestino}`);
		},
	};
};

export default usarNavegacion;
