import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

const Cuerpo = (props: Props) => {
	
	return <div className="mt-4 mb-8 px-2">
		{props.children}
	</div>;
};

export default Cuerpo;
