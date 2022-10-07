import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home";

const App = () => {
	return (
		<div className='App'>
			<Router>
				<Routes>
					<Route path="/" element={<Home/>} />
					{/* <Route exact path="page1" element={<Page1 />} />
					<Route exact path="page2" element={<Page2 />} />
					<Route exact path="page3" element={<Page3 />} /> */}
				</Routes>
			</Router>
		</div>
	);
};

export default App;
