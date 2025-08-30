import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AppContextProvider } from "./AppContext";
import { RequiereAutenticacion } from "./components/requiere-autenticacion";
import CarpetasHome from "./Pantallas/CarpetasHome/CarpetasHome";
import EscritosHome from "./Pantallas/EscritosHome/EscritosHome";
import Login from "./Pantallas/login";
import Matriz from "./Pantallas/Matriz";
import ModoLectura from "./Pantallas/modo-lectura";
import NuevaCarpeta from "./Pantallas/NuevaCarpeta";
import NuevoEscrito from "./Pantallas/NuevoEscrito";
import Papelera from "./Pantallas/Papelera";
import VerEscrito from "./Pantallas/VerEscrito";
import rutas from "./rutas";

const queryClient = new QueryClient();

const App = () => {
	return (
		<div className='App font-roboto'>
			<Toaster />
			<QueryClientProvider client={queryClient}>
				<AppContextProvider>
					<Router>
						<Routes>
							<Route path='/login' element={<Login />} />
							<Route
								element={
									<RequiereAutenticacion>
										<Matriz />
									</RequiereAutenticacion>
								}
							>
								<Route path={rutas.RAIZ} element={<CarpetasHome />} />
								<Route path={rutas.CARPETAS_HOME} element={<CarpetasHome />} />
								<Route path={rutas.ESCRITOS_HOME} element={<EscritosHome />} />
								<Route path={rutas.NUEVO_ESCRITO} element={<NuevoEscrito />} />
								<Route path={rutas.NUEVA_CARPETA} element={<NuevaCarpeta />} />
								<Route path={rutas.PAPELERA} element={<Papelera />} />
								<Route path={rutas.VER_ESCRITO} element={<VerEscrito />} />
								<Route path={rutas.VER_ESCRITO_PAPELERA} element={<VerEscrito />} />
								<Route path={rutas.MODO_LECTURA} element={<ModoLectura />} />
							</Route>
							<Route
								path='*'
								element={
									<RequiereAutenticacion>
										<CarpetasHome />
									</RequiereAutenticacion>
								}
							/>
						</Routes>
					</Router>
				</AppContextProvider>
			</QueryClientProvider>
		</div>
	);
};

export default App;
