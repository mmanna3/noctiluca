interface IProps {
	titulo: string;
	subtitulo: string;
	fecha?: string;
	onClick: () => void;
}

function parseISOStringtoddMMyy(dateString: string) {
	const dateObj = new Date(dateString);

	// Get year, month (0-indexed), and day components
	const year = dateObj.getFullYear();
	const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Add leading zero for single-digit months
	const day = String(dateObj.getDate()).padStart(2, "0"); // Add leading zero for single-digit days

	// Return formatted date string
	return `${day}.${month}.${year.toString().slice(-2)}`;
}

const ListaItem = (props: IProps) => {
	return (
		<div className='px-2 py-3 text-sm border-b' onClick={props.onClick}>
			<p className='text-xs text-gray-400 pb-1'>
				{props.fecha && parseISOStringtoddMMyy(props.fecha)}
			</p>
			<p className='text-base'>{props.titulo}</p>
			<p className='text-sm text-gray-500'>{props.subtitulo}</p>
		</div>
	);
};

export default ListaItem;
