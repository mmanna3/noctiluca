import { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className?: string;
}

const Cuerpo = ({ children, className }: Props) => {
	return <div className={`mt-6 mb-4 ${className ?? ""}`.trim()}>{children}</div>;
};

export default Cuerpo;
