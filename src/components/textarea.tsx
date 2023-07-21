interface Props {
    valor: string;
    cuandoCambie: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    hayError?: boolean;
    mensajeError?: string;
    autoFocus?: boolean;
	sinBorde?: boolean;   
}

const Textarea = (props: Props) => {
	
	return <>
		<textarea 
			autoFocus={props.autoFocus} 
			value={props.valor} 
			placeholder={props.placeholder} 
			onChange={props.cuandoCambie} 
			className={`border-b w-full text-slate-900 h-screen text-base px-2 py-2 resize-none focus:outline-none ${props.sinBorde && "border-none"}`}/>
		{props.hayError ? 
			<p className="mt-2 px-2 text-red-600">{props.mensajeError}</p> : ""}
	</>;
};

export default Textarea;
