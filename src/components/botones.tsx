import { ReactNode } from "react";

interface Props {
    soloBorde?: boolean;
    children: ReactNode;
    onClick?: () => void;
    className?: string;
}

export const Boton = (props: Props) => {
	
	if (props.soloBorde)
		return (
			<button onClick={props.onClick} 
				className={` hover:bg-yellow-200 text-slate-900 border-slate-900 border h-10 px-4 text-sm font-semibold rounded ${props.className}`}>
				{props.children}
			</button>
		);
	else
		return (
			<button onClick={props.onClick} 
				className={`bg-slate-900 hover:bg-yellow-200 hover:text-slate-900 hover:border-black hover:border text-white font-semibold py-2 px-4 rounded ${props.className}`}>
				{props.children}
			</button>
		);
};

export const BotonIcono = (props: Props) => {

	return (
		<button onClick={props.onClick} 
			className={`bg-slate-900 hover:bg-yellow-200 hover:text-slate-900 hover:border-black hover:border text-white font-bold rounded-full h-10 w-10 pl-1 ${props.className}`}>
			{props.children}
		</button>
	);	
};
