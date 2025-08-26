import { api } from "@/api/api";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import { useAuth } from "../hooks/use-auth";
import usarNavegacion from "../usarNavegacion";
import { fechaEsDeHaceMenosDe5Minutos } from "../utilidades";

const UseSeguridad = () => {
	const [tieneAcceso, setTieneAcceso] = useState<boolean>(true);
	const { estado } = useAppContext();
	const { carpetaId } = usarNavegacion();
	const { isAuthenticated } = useAuth();

	const { data } = useApiQuery({
		key: ["carpeta" + carpetaId],
		fn: async () => await api.carpetaGET(Number(carpetaId)),
	});

	useEffect(() => {
		const verificarAcceso = () => {
			if (
				(data && data.requiereAutenticacion === false) ||
				(isAuthenticated &&
					estado.fechaHoraQueIngresoElPassword &&
					fechaEsDeHaceMenosDe5Minutos(new Date(estado.fechaHoraQueIngresoElPassword)))
			) {
				setTieneAcceso(true);
				console.log("seteando tiene acceso en true");
			} else {
				setTieneAcceso(false);
			}
		};

		verificarAcceso();
		console.log("useEffect useSeguridad");
	}, [estado, isAuthenticated, data]);

	return { tieneAcceso };
};

export default UseSeguridad;
