import usarNavegacion from "../../usarNavegacion";
import ListaDeEscritos from "./ListaDeEscritos";
import Encabezado from "../../components/encabezado";
import { Boton, BotonIcono } from "../../components/botones";
import { PlusIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import Cuerpo from "../../components/cuerpo";


const EscritosHome = () => {

	const {irACarpetasHome, irANuevoEscrito, carpetaId} = usarNavegacion();

	return <>
		<Encabezado>
			<Boton soloBorde className="flex justify-between items-center" onClick={irACarpetasHome}>
				<ChevronLeftIcon className="w-4 h-4 mr-2"/>/{carpetaId}
			</Boton>
			<BotonIcono onClick={irANuevoEscrito}>
				<PlusIcon className="h-8 w-8" />
			</BotonIcono>
		</Encabezado>
		<Cuerpo>
			<ListaDeEscritos />
		</Cuerpo>
	</>;
};

export default EscritosHome;
