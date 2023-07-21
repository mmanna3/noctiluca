import * as React from "react";

type Dispatch = React.Dispatch<React.SetStateAction<{
  password: string;
  fechaHoraQueIngresoElPassword: string;
}>>

type State = {
  password: string;
  fechaHoraQueIngresoElPassword: string;
}

const AppContext = React.createContext<{estado: State; cambiarEstado: Dispatch} | undefined>(undefined);


interface Hijo {
    children: React.ReactNode
}

const AppContextProvider = ({children}: Hijo) => {
	const [estado, cambiarEstado] = React.useState({password: "", fechaHoraQueIngresoElPassword: ""});
	const valor = {estado, cambiarEstado};
	return <AppContext.Provider value={valor}>{children}</AppContext.Provider>;
};

function useAppContext() {
	const context = React.useContext(AppContext);
	if (context === undefined) {
		throw new Error("useAppContext debe ser usado adentro de un AppContextProvider");
	}
	return context;
}
  
export {AppContextProvider, useAppContext};