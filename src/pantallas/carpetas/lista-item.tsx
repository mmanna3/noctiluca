import { ICarpetaDTO, PropositoCarpetaEnum } from "@/api/clients";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Bars3Icon } from "@heroicons/react/24/outline";
import ListaItem from "../../components/ui/lista-item";
import usarNavegacion from "../../usar-navegacion";

interface IListaDeCarpetasItem extends ICarpetaDTO {
	isDisabled?: boolean;
}

const subtituloCarpeta = (c: IListaDeCarpetasItem): string => {
	if (c.propositoCarpeta === PropositoCarpetaEnum._1) {
		const cantidad = c.cantidadDeSubCarpetas ?? 0;
		if (cantidad === 1) return "1 lista";
		return `${cantidad} listas`;
	}

	const cantidadDeEscritos = c.cantidadDeEscritos ?? 0;
	if (cantidadDeEscritos === 1) return "1 escrito";
	return `${cantidadDeEscritos} escritos`;
};

const ListaDeCarpetasItem = (c: IListaDeCarpetasItem) => {
	const { verEscritosDeLaCarpeta } = usarNavegacion();

	const sortableDisabled = c.isDisabled;

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: c.id || c.titulo,
		disabled: sortableDisabled,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} style={style} className='relative group'>
			{!sortableDisabled && (
				<div
					{...attributes}
					{...listeners}
					className='absolute left-0 top-0 h-full w-8 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity'
				>
					<Bars3Icon className='h-4 w-4 text-gray-400' />
				</div>
			)}
			<div className='pl-8'>
				<ListaItem
					titulo={c.titulo ?? ""}
					subtitulo={subtituloCarpeta(c)}
					onClick={() => c.id && verEscritosDeLaCarpeta(c.id)}
				/>
			</div>
		</div>
	);
};

export default ListaDeCarpetasItem;
