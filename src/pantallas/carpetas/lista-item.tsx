import { ICarpetaDTO, PropositoCarpetaEnum } from "@/api/clients";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Bars3Icon } from "@heroicons/react/24/outline";
import ListaItem from "../../components/ui/lista-item";
import usarNavegacion from "../../usar-navegacion";

interface IListaDeCarpetasItem extends ICarpetaDTO {
	isDisabled?: boolean;
	esSistema?: boolean;
}

const subtituloCarpeta = (carpeta: IListaDeCarpetasItem): string => {
	if (carpeta.propositoCarpeta === PropositoCarpetaEnum._1) {
		return "Objetivos diarios, semanales y mensuales";
	}
	if (
		carpeta.propositoCarpeta === PropositoCarpetaEnum._2 ||
		carpeta.propositoCarpeta === PropositoCarpetaEnum._3 ||
		carpeta.propositoCarpeta === PropositoCarpetaEnum._4
	) {
		return "Histórico de listas";
	}

	const cantidadDeEscritos = carpeta.cantidadDeEscritos ?? 0;
	if (cantidadDeEscritos === 1) return "1 escrito";
	return `${cantidadDeEscritos} escritos`;
};

const ListaDeCarpetasItem = (carpeta: IListaDeCarpetasItem) => {
	const { verEscritosDeLaCarpeta } = usarNavegacion();

	const sortableDisabled = carpeta.isDisabled || carpeta.esSistema;

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: carpeta.id || carpeta.titulo,
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
			<div className={sortableDisabled ? "pl-2" : "pl-8"}>
				<ListaItem
					titulo={carpeta.titulo ?? ""}
					subtitulo={subtituloCarpeta(carpeta)}
					onClick={() => carpeta.id && verEscritosDeLaCarpeta(carpeta.id)}
				/>
			</div>
		</div>
	);
};

export default ListaDeCarpetasItem;
