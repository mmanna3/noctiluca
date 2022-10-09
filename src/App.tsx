import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { auth } from "./firebase";
import Home from "./Home";
import Logueo from "./Logueo";
import NuevoEscrito from "./NuevoEscrito";
import VerEscrito from "./VerEscrito";

const App = () => {

	const [user, setUser] = useState<User | null>(null);

	useEffect(()=>{		
		auth.onAuthStateChanged(()=> {
			setUser(auth.currentUser);
		});
	}, []);

	return (
		<div className='App'>
			<Router>
				<Routes>
					{
						!user ?
							<Route path="/" element={<Logueo/>} /> :
							<>
								<Route path="/" element={<Home/>} />
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
