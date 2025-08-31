import { api } from "@/api/api";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { Boton } from "../../components/ui/botones";
import Cuerpo from "../../components/ui/cuerpo";
import Encabezado from "../../components/ui/encabezado";
import usarNavegacion from "../../usar-navegacion";
import ListaDeEscritos from "../escritos/lista";

const Papelera = () => {
	const { irAlInicio } = usarNavegacion();

	const { data, isLoading, isError } = useApiQuery({
		key: ["papelera"],
		fn: async () => await api.papelera(),
	});

	return (
		<>
			<Encabezado>
				<Boton soloBorde className='flex justify-between items-center' onClick={irAlInicio}>
					/tacho
				</Boton>
			</Encabezado>
			<Cuerpo>
				<ListaDeEscritos data={data || []} isLoading={isLoading} isError={isError} />
			</Cuerpo>
		</>
	);
};

export default Papelera;
