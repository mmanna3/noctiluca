import { api } from "@/api/api";
import { EscritoDTO } from "@/api/clients";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import usarNavegacion from "@/usar-navegacion";
import { useState } from "react";
import { Boton } from "../../components/ui/botones";
import Cuerpo from "../../components/ui/cuerpo";
import Encabezado from "../../components/ui/encabezado";
import Input from "../../components/ui/input";
import Textarea from "../../components/ui/textarea";

const indiceAleatorio = (cantidad: number) => Math.floor(Math.random() * cantidad);

const ModoLectura = () => {
	const { irACarpetasHome } = usarNavegacion();

	const { data, isLoading, isError } = useApiQuery({
		key: ["escritos"],
		fn: async () => await api.escritoAll(),
	});

	const [escritoSeleccionado, setEscritoSeleccionado] = useState<EscritoDTO | null>(null);

	const escritoActual =
		escritoSeleccionado || (data && data.length > 0 ? data[indiceAleatorio(data.length)] : null);

	const irAlProximoEscrito = () => {
		if (data && data.length > 0) {
			setEscritoSeleccionado(data[indiceAleatorio(data.length)]);
		}
	};

	if (isLoading) return <div>Cargando...</div>;
	if (isError) return <div>Error al cargar los escritos</div>;
	if (!data || data.length === 0) return <div>No se encontraron escritos</div>;
	if (!escritoActual) return <div>Seleccionando escrito...</div>;

	return (
		<div>
			<Encabezado>
				<p className='text-md text-slate-400'>
					{escritoActual.fechaHoraCreacion &&
						(() => {
							const fecha = new Date(escritoActual.fechaHoraCreacion);
							const dia = fecha.getDate().toString().padStart(2, "0");
							const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
							const año = fecha.getFullYear().toString().slice(-2);
							const horaAjustada = fecha.getHours() - 3;
							const hora = (horaAjustada < 0 ? horaAjustada + 24 : horaAjustada)
								.toString()
								.padStart(2, "0");
							const minutos = fecha.getMinutes().toString().padStart(2, "0");
							return `${dia}-${mes}-${año} ${hora}:${minutos}`;
						})()}
				</p>
				<Boton
					soloBorde
					color='gris'
					className='flex justify-between items-center ml-auto'
					onClick={irAlProximoEscrito}
				>
					{">"}
				</Boton>
			</Encabezado>

			<Cuerpo>
				<Input valor={escritoActual.titulo} sinBorde autoFocus textoReGrande soloLectura />
				<p className='text-sm text-slate-400 ml-2 mt-[-10px]'>{escritoActual.carpetaTitulo}</p>
				<div className='pt-2'>
					<Textarea valor={escritoActual.cuerpo || ""} sinBorde soloLectura />
				</div>
			</Cuerpo>
			<Boton
				soloBorde
				chiquito
				color='gris'
				className='flex justify-between items-center'
				onClick={irACarpetasHome}
			>
				{"<"}
			</Boton>
		</div>
	);
};

export default ModoLectura;
