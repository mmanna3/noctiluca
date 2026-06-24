import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AppContextProvider } from "./app-context";
import { RequiereAutenticacion } from "./components/requiere-autenticacion";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import Encuadre from "./pantallas/encuadre";
import Inicio from "./pantallas/inicio";
import Login from "./pantallas/login/login";
import rutas from "./rutas";

const NuevaCarpeta = React.lazy(() => import("./pantallas/carpetas/nueva-carpeta"));
const VerCarpeta = React.lazy(() => import("./pantallas/carpetas/ver-carpeta"));
const NuevoEscrito = React.lazy(() => import("./pantallas/escritos/nuevo-escrito"));
const VerEscrito = React.lazy(() => import("./pantallas/escritos/ver-escrito"));
const ModoLectura = React.lazy(() => import("./pantallas/modo-lectura/modo-lectura"));
const Tacho = React.lazy(() => import("./pantallas/tacho/tacho"));
const AdministrarHabitos = React.lazy(() => import("./pantallas/habitos/administrar-habitos"));
const ResumenSemanal = React.lazy(() => import("./pantallas/habitos/resumen-semanal"));
const VerListaObjetivos = React.lazy(() => import("./pantallas/objetivos/ver-lista-objetivos"));

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			gcTime: 10 * 60 * 1000,
			retry: 1,
		},
	},
});

const App = () => {
	return (
		<div className='App font-roboto'>
			<Toaster />
			<QueryClientProvider client={queryClient}>
				<AppContextProvider>
					<Router>
						<Suspense
							fallback={
								<div className='flex items-center justify-center h-screen'>
									<LoadingSpinner className='w-8 h-8 text-gray-400' />
								</div>
							}
						>
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
									<Route path={rutas.NUEVA_SUBCARPETA} element={<NuevaCarpeta />} />
									<Route path={rutas.PAPELERA} element={<Tacho />} />
									<Route path={rutas.VER_ESCRITO} element={<VerEscrito />} />
									<Route path={rutas.VER_ESCRITO_PAPELERA} element={<VerEscrito />} />
									<Route path={rutas.MODO_LECTURA} element={<ModoLectura />} />
									<Route path={rutas.HABITOS} element={<AdministrarHabitos />} />
									<Route path={rutas.RESUMEN_HABITOS} element={<ResumenSemanal />} />
									<Route path={rutas.LISTA_OBJETIVOS} element={<VerListaObjetivos />} />
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
						</Suspense>
					</Router>
				</AppContextProvider>
			</QueryClientProvider>
		</div>
	);
};

export default App;
