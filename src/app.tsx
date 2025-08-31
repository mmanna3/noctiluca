import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AppContextProvider } from "./app-context";
import { RequiereAutenticacion } from "./components/requiere-autenticacion";
import NuevaCarpeta from "./pantallas/carpetas/nueva-carpeta";
import VerCarpeta from "./pantallas/carpetas/ver-carpeta";
import Encuadre from "./pantallas/encuadre";
import NuevoEscrito from "./pantallas/escritos/nuevo-escrito";
import VerEscrito from "./pantallas/escritos/ver-escrito";
import Inicio from "./pantallas/inicio";
import Login from "./pantallas/login/login";
import ModoLectura from "./pantallas/modo-lectura/modo-lectura";
import Tacho from "./pantallas/tacho/tacho";
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
										<Encuadre />
									</RequiereAutenticacion>
								}
							>
								<Route path={rutas.RAIZ} element={<Inicio />} />
								<Route path={rutas.CARPETAS_HOME} element={<Inicio />} />
								<Route path={rutas.ESCRITOS_HOME} element={<VerCarpeta />} />
								<Route path={rutas.NUEVO_ESCRITO} element={<NuevoEscrito />} />
								<Route path={rutas.NUEVA_CARPETA} element={<NuevaCarpeta />} />
								<Route path={rutas.PAPELERA} element={<Tacho />} />
								<Route path={rutas.VER_ESCRITO} element={<VerEscrito />} />
								<Route path={rutas.VER_ESCRITO_PAPELERA} element={<VerEscrito />} />
								<Route path={rutas.MODO_LECTURA} element={<ModoLectura />} />
							</Route>
							<Route
								path='*'
								element={
									<RequiereAutenticacion>
										<Inicio />
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
