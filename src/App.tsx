import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import CarpetasLista from "./Pantallas/CarpetasHome/ListaDeCarpetas";
import { auth } from "./firebase";
import Home from "./Pantallas/EscritosHome/EscritosHome";
import Logueo from "./Pantallas/Logueo";
import NuevoEscrito from "./Pantallas/NuevoEscrito";
import VerEscrito from "./Pantallas/VerEscrito";

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
								<Route path="/" element={<CarpetasLista/>} />
								<Route path="/home" element={<Home/>} />
								<Route path="/nuevo" element={<NuevoEscrito/>} />
								<Route path="/ver/:id" element={<VerEscrito/>} />
							</>
					}
				</Routes>
			</Router>
		</div>
	);
};

export default App;
