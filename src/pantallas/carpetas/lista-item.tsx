import { ICarpetaDTO } from "@/api/clients";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Bars3Icon } from "@heroicons/react/24/outline";
import ListaItem from "../../components/ui/lista-item";
import usarNavegacion from "../../usar-navegacion";

interface IListaDeCarpetasItem extends ICarpetaDTO {
	isDisabled?: boolean;
}

const ListaDeCarpetasItem = (carpeta: IListaDeCarpetasItem) => {
	const { verEscritosDeLaCarpeta } = usarNavegacion();

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: carpeta.id || carpeta.titulo,
		disabled: carpeta.isDisabled,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const cantidadDeEscritos = carpeta.cantidadDeEscritos;
	let texto = "";
	if (cantidadDeEscritos === 1) texto = "1 escrito";
	else texto = `${cantidadDeEscritos} escritos`;

	return (
		<div ref={setNodeRef} style={style} className='relative group'>
			{!carpeta.isDisabled && (
				<div
					{...attributes}
					{...listeners}
					className='absolute left-0 top-0 h-full w-8 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity'
				>
					<Bars3Icon className='h-4 w-4 text-gray-400' />
				</div>
			)}
			<div className={carpeta.isDisabled ? "pl-2" : "pl-8"}>
				<ListaItem
					titulo={carpeta.titulo}
					subtitulo={texto}
					onClick={() => carpeta.id && verEscritosDeLaCarpeta(carpeta.id)}
				/>
			</div>
		</div>
	);
};

export default ListaDeCarpetasItem;
