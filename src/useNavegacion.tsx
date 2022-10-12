import { useNavigate } from "react-router-dom";

const useNavegacion = () => {

	const navigate = useNavigate();

	return {
		navegarAEscritosHome: (carpetaTitulo: string) => {
			navigate(`${carpetaTitulo}/escritos`);
		},
		irAVerEscrito: (escritoId: string) => {
			navigate(`ver/${escritoId}`);
		}
	};
};

export default useNavegacion;