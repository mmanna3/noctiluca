
interface IProps {
    titulo: string;
    subtitulo: string;
    onClick: () => void;
}

const ListaItem = (props: IProps) => {

	return <div className="px-2 py-3 text-sm" onClick={props.onClick}>
		<p className="text-base">{props.titulo}</p>
		<p className="text-sm text-gray-600">{props.subtitulo}</p>
	</div>
	;
};

export default ListaItem;
