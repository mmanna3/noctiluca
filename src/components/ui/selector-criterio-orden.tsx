import { CriterioDeOrdenEnum } from "@/api/clients";

interface SelectorCriterioOrdenProps {
	valor: CriterioDeOrdenEnum;
	onChange: (valor: CriterioDeOrdenEnum) => void;
	disabled?: boolean;
}

const SelectorCriterioOrden = ({
	valor,
	onChange,
	disabled = false,
}: SelectorCriterioOrdenProps) => {
	const opciones = [
		{ valor: CriterioDeOrdenEnum._1, etiqueta: "Creación (más reciente)" },
		{ valor: CriterioDeOrdenEnum._2, etiqueta: "Edición (más reciente)" },
		{ valor: CriterioDeOrdenEnum._3, etiqueta: "A-Z" },
		{ valor: CriterioDeOrdenEnum._4, etiqueta: "Creación (más antigua)" },
		{ valor: CriterioDeOrdenEnum._5, etiqueta: "Edición (más antigua)" },
		{ valor: CriterioDeOrdenEnum._6, etiqueta: "Z-A" },
	];

	return (
		<select
			value={valor}
			onChange={(e) => onChange(Number(e.target.value) as CriterioDeOrdenEnum)}
			disabled={disabled}
			className='px-3 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed'
		>
			{opciones.map((opcion) => (
				<option key={opcion.valor} value={opcion.valor}>
					{opcion.etiqueta}
				</option>
			))}
		</select>
	);
};

export default SelectorCriterioOrden;
