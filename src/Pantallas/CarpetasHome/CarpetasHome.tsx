import { auth } from "../../firebase";
import ListaDeCarpetas from "./ListaDeCarpetas";
import usarNavegacion from "../../usarNavegacion";
import Boton from "../../components/boton";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";

const CarpetasHome = () => {

	const {irANuevaCarpeta} = usarNavegacion();

	return (
		<div className="p-3">
			<div className="flex justify-between w-full">
				<Boton soloBorde>/</Boton>
				<Boton onClick={irANuevaCarpeta} className="rounded-full h-12 w-12 px-3">
					<PlusIcon />
				</Boton>
			</div>
			<div className="mt-4 mb-8 px-2">
				<ListaDeCarpetas />
			</div>
			<Boton soloBorde className="w-44 flex justify-around items-center" onClick={() => {auth.signOut(); localStorage.removeItem("noctiluca.uid");}}>
				<XMarkIcon className="w-6"/>		
				Cerrar sesión
			</Boton>
		</div>
	);
};

export default CarpetasHome;
