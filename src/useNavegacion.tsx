import { useNavigate } from "react-router-dom";

const useNavegacion = () => {

	const navigate = useNavigate();

	return {
		navegarAEscritosHome: (carpetaTitulo: string) => {
			navigate(`${carpetaTitulo}/escritos`);
		}
	};
};

export default useNavegacion;