import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home";
// import Logueo from "./Logueo";
import NuevoEscrito from "./NuevoEscrito";
import VerEscrito from "./VerEscrito";

const App = () => {	
	return (
		<div className='App'>
			<Router>
				<Routes>
					<Route path="/" element={<Home/>} />
					<Route path="/home" element={<Home/>} />
					<Route path="/nuevo" element={<NuevoEscrito/>} />
					<Route path="/ver/:id" element={<VerEscrito/>} />
				</Routes>
			</Router>
		</div>
	);
};

export default App;
