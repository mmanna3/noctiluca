interface Props {
    valor: string;
    cuandoCambie: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    hayError: boolean;
    mensajeError: string;
    autoFocus: boolean;    
}

const Input = (props: Props) => {
	
	return <>
		<input autoFocus={props.autoFocus} value={props.valor} placeholder={props.placeholder} onChange={props.cuandoCambie} className="border-b w-full text-lg px-2 py-2 focus:outline-none"/>
		{props.hayError ? <p className="mt-2 px-2 text-red-600">{props.mensajeError}</p> : ""}
	</>;
};

export default Input;