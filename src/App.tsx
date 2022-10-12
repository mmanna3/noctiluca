import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./firebase";
import CarpetasHome from "./Pantallas/CarpetasHome/CarpetasHome";
import EscritosHome from "./Pantallas/EscritosHome/EscritosHome";
import Logueo from "./Pantallas/Logueo";
import NuevoEscrito from "./Pantallas/NuevoEscrito";
import VerEscrito from "./Pantallas/VerEscrito";
import rutas from "./rutas";

const App = () => {

	const [user, setUser] = useState<User | null>(null);		

	useEffect(()=>{		
		auth.onAuthStateChanged((user)=> {
			setUser(user);
			if (user) {				
				localStorage.setItem("noctiluca.uid", user.uid);
			}			
		});
	}, []);

	return (
		<div className='App'>
			<Router>
				<Routes>
					{
						!user && !localStorage.getItem("noctiluca.uid") ?
							<Route path="/" element={<Logueo/>} /> :
							<>
								<Route path={rutas.RAIZ} element={<CarpetasHome/>} />
								<Route path={rutas.CARPETAS_HOME} element={<CarpetasHome/>} />
								<Route path={rutas.ESCRITOS_HOME} element={<EscritosHome/>} />
								<Route path={rutas.NUEVO_ESCRITO} element={<NuevoEscrito/>} />
								<Route path={rutas.VER_ESCRITO} element={<VerEscrito/>} />
							</>
					}
				</Routes>
			</Router>
		</div>
	);
};

export default App;
