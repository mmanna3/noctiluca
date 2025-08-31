import { ReactNode } from "react";

interface ButtonProps {
	children: ReactNode;
	type?: "button" | "submit" | "reset";
	className?: string;
	disabled?: boolean;
	onClick?: () => void;
}

export const Button = ({
	children,
	type = "button",
	className = "",
	disabled = false,
	onClick,
}: ButtonProps) => {
	return (
		<button
			type={type}
			disabled={disabled}
			onClick={onClick}
			className={`bg-slate-900 hover:bg-yellow-200 hover:text-slate-900 hover:border-black hover:border text-white font-semibold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
		>
			{children}
		</button>
	);
};
