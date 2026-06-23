import { IEscritoDTO } from "@/api/clients";
import { useCallback, useRef } from "react";
import ListaItem from "../../components/ui/lista-item";
import usarNavegacion from "../../usar-navegacion";

interface Props extends IEscritoDTO {
	modoSeleccion?: boolean;
	seleccionado?: boolean;
	mostrarCarpeta?: boolean;
	onToggleSeleccion?: (id: number) => void;
	onLongPress?: (id: number) => void;
}

const Escrito = (props: Props) => {
	const { irAVerEscrito } = usarNavegacion();
	const obtenerResumen = (texto: string) => texto.slice(0, 80) + (texto.length > 80 ? "..." : "");
	const resumenCuerpo = obtenerResumen(props.cuerpo || "");
	const subtitulo =
		props.mostrarCarpeta && props.carpetaTitulo
			? `${props.carpetaTitulo} · ${resumenCuerpo}`
			: resumenCuerpo;
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const longPressTriggered = useRef(false);

	const iniciarLongPress = useCallback(() => {
		longPressTriggered.current = false;
		timerRef.current = setTimeout(() => {
			longPressTriggered.current = true;
			if (props.onLongPress && props.id) {
				props.onLongPress(props.id);
			}
		}, 500);
	}, [props.onLongPress, props.id]);

	const cancelarLongPress = useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	const handleClick = () => {
		if (longPressTriggered.current) return;
		if (props.modoSeleccion) {
			if (props.onToggleSeleccion && props.id) {
				props.onToggleSeleccion(props.id);
			}
		} else {
			irAVerEscrito(props.id?.toString() || "", props.carpetaId);
		}
	};

	return (
		<div
			className={`flex items-center ${props.modoSeleccion ? "cursor-pointer" : ""}`}
			onMouseDown={!props.modoSeleccion ? iniciarLongPress : undefined}
			onMouseUp={cancelarLongPress}
			onMouseLeave={cancelarLongPress}
			onTouchStart={!props.modoSeleccion ? iniciarLongPress : undefined}
			onTouchEnd={cancelarLongPress}
		>
			{props.modoSeleccion && (
				<label className='ml-2 mr-1 shrink-0 cursor-pointer flex items-center'>
					<input
						type='checkbox'
						checked={props.seleccionado || false}
						onChange={() =>
							props.onToggleSeleccion && props.id && props.onToggleSeleccion(props.id)
						}
						className='sr-only peer'
					/>
					<span className='h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:bg-black peer-checked:border-black'>
						{/* {(props.seleccionado || false) && <CheckIcon className='h-4 w-4 text-white' />} */}
					</span>
				</label>
			)}
			<div className='flex-1'>
				<ListaItem
					fecha={props.fechaHoraCreacion?.toString()}
					titulo={props.titulo ?? ""}
					subtitulo={subtitulo}
					onClick={handleClick}
				/>
			</div>
		</div>
	);
};

export default Escrito;
