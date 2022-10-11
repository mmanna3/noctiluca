import { ICarpeta } from "./Interfaces";
import { createContext, useState } from "react";

export interface IContexto {
	carpetaSeleccionada: ICarpeta;
	seleccionarCarpeta: React.Dispatch<React.SetStateAction<ICarpeta>> | null ;
}

const carpetaVacia = {
	titulo: "",
	escritos: []
};

const nuevoContexto = {
	carpetaSeleccionada: carpetaVacia,
	seleccionarCarpeta: null
};

export const Contexto = createContext<IContexto>(nuevoContexto);

export const ContextoProvider = ({children}: any) => {

	const [carpeta, seleccionar] = useState<ICarpeta>(carpetaVacia);

	const nuevoContexto: IContexto = {
		carpetaSeleccionada: carpeta,
		seleccionarCarpeta: seleccionar
	};

	return <Contexto.Provider value={nuevoContexto}>{children}</Contexto.Provider>;
};