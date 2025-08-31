import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AppContextProvider } from "./app-context";
import { RequiereAutenticacion } from "./components/requiere-autenticacion";
import CarpetasHome from "./pantallas/carpetas-home/carpetas-home";
import EscritosHome from "./pantallas/escritos-home/escritos-home";
import Login from "./pantallas/login";
import Matriz from "./pantallas/matriz";
import ModoLectura from "./pantallas/modo-lectura";
import NuevaCarpeta from "./pantallas/nueva-carpeta";
import NuevoEscrito from "./pantallas/nuevo-escrito";
import Papelera from "./pantallas/papelera";
import VerEscrito from "./pantallas/ver-escrito";
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
