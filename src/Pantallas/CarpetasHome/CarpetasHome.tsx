import { auth } from "../../firebase";
import ListaDeCarpetas from "./ListaDeCarpetas";
import usarNavegacion from "../../usarNavegacion";
import Boton from "../../components/boton";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Encabezado from "../../components/encabezado";
import Cuerpo from "../../components/cuerpo";

const CarpetasHome = () => {

	const {irANuevaCarpeta} = usarNavegacion();

	return (
		<>
			<Encabezado>
				<Boton soloBorde>/</Boton>
				<Boton onClick={irANuevaCarpeta} className="rounded-full h-12 w-12 px-3">
					<PlusIcon />
				</Boton>
			</Encabezado>
			<Cuerpo>
				<ListaDeCarpetas />
			</Cuerpo>
			<Boton soloBorde className="w-44 flex justify-around items-center" onClick={() => {auth.signOut(); localStorage.removeItem("noctiluca.uid");}}>
				<XMarkIcon className="w-6"/>		
				Cerrar sesión
			</Boton>
		</>
	);
};

export default CarpetasHome;
