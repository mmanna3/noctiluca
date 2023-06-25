import { ReactNode } from "react";

interface Props {
    soloBorde?: boolean;
    children: ReactNode;
    onClick?: () => void;
    className?: string;
}

const Boton = (props: Props) => {
	
	if (props.soloBorde)
		return (
			<button onClick={props.onClick} 
				className={` hover:bg-green-200 text-slate-900 border-slate-900 border font-bold py-2 px-4 rounded ${props.className}`}>
				{props.children}
			</button>
		);
	else
		return (
			<button onClick={props.onClick} 
				className={`bg-slate-900 hover:bg-green-800 text-white font-bold py-2 px-4 rounded ${props.className}`}>
				{props.children}
			</button>
		);
};

export default Boton;
