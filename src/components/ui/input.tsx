interface Props {
	valor: string;
	cuandoCambie?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	hayError?: boolean;
	mensajeError?: string;
	autoFocus: boolean;
	sinBorde?: boolean;
	textoReGrande?: boolean;
	soloLectura?: boolean;
}

const Input = (props: Props) => {
	return (
		<>
			<input
				autoFocus={props.autoFocus}
				readOnly={props.soloLectura}
				value={props.valor}
				placeholder={props.placeholder}
				onChange={props.cuandoCambie}
				className={`border-b text-slate-900 w-full text-lg px-2 py-2 font-medium focus:outline-none ${
					props.sinBorde && "border-none"
				} ${props.textoReGrande && "text-2xl"}`}
			/>
			{props.hayError ? <p className='mt-2 px-2 text-red-600'>{props.mensajeError}</p> : ""}
		</>
	);
};

export default Input;
