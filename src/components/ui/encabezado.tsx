import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

const Encabezado = (props: Props) => {
	
	return <div className="flex justify-between w-full">
		{props.children}
	</div>;
};

export default Encabezado;
