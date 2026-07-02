interface Props {
	className?: string;
	mensaje?: string;
}

const AvisoSoloOnline = ({
	className = "",
	mensaje = "Esta función requiere conexión a internet.",
}: Props) => (
	<div
		role='status'
		className={`text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 ${className}`}
	>
		{mensaje}
	</div>
);

export default AvisoSoloOnline;
