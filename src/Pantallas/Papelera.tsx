import { api } from "@/api/api";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { Boton } from "../components/botones";
import Cuerpo from "../components/cuerpo";
import Encabezado from "../components/encabezado";
import usarNavegacion from "../usarNavegacion";
import ListaDeEscritos from "./EscritosHome/ListaDeEscritos";

const Papelera = () => {
	const { irACarpetasHome } = usarNavegacion();

	const { data, isLoading, isError } = useApiQuery({
		key: ["papelera"],
		fn: async () => await api.papelera(),
	});

	return (
		<>
			<Encabezado>
				<Boton soloBorde className='flex justify-between items-center' onClick={irACarpetasHome}>
					/Papelera
				</Boton>
			</Encabezado>
			<Cuerpo>
				<ListaDeEscritos data={data || []} isLoading={isLoading} isError={isError} />
			</Cuerpo>
		</>
	);
};

export default Papelera;
