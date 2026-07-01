import { usarPapelera } from "@/sync/lecturas";
import { Boton } from "../../components/ui/botones";
import Cuerpo from "../../components/ui/cuerpo";
import Encabezado from "../../components/ui/encabezado";
import usarNavegacion from "../../usar-navegacion";
import ListaDeEscritos from "../escritos/lista";

const Tacho = () => {
	const { irAlInicio } = usarNavegacion();

	const data = usarPapelera();
	const isLoading = data === undefined;
	const isError = false;

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

export default Tacho;
