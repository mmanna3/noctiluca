import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import NuevoEscrito from "./NuevoEscrito";

const App = () => {
	return (
		<div className='App'>
			<Router>
				<Routes>
					<Route path="/" element={<Home/>} />
					<Route path="/nuevo" element={<NuevoEscrito/>} />
				</Routes>
			</Router>
		</div>
	);
};

export default App;
