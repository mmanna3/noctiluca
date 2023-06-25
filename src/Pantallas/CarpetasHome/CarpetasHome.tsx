import { auth } from "../../firebase";
import ListaDeCarpetas from "./ListaDeCarpetas";
import usarNavegacion from "../../usarNavegacion";
import Boton from "../../components/boton";

const CarpetasHome = () => {

	const {irANuevaCarpeta} = usarNavegacion();

	return (
		<div className="p-3">
			<div className="flex justify-between w-full">
				<Boton soloBorde>/</Boton>
				<Boton soloBorde onClick={irANuevaCarpeta} className="rounded-full h-12 w-12 px-3">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
				</Boton>
			</div>
			<ListaDeCarpetas />
			<Boton soloBorde className="w-40 mt-2 flex justify-between" onClick={() => {auth.signOut(); localStorage.removeItem("noctiluca.uid");}}>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
					<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
				</svg>				
				Cerrar sesión
			</Boton>
		</div>
	);
};

export default CarpetasHome;
