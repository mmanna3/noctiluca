import { ReactNode } from "react";

interface Props {
	soloBorde?: boolean;
	sinBorde?: boolean;
	chiquito?: boolean;
	color?: "default" | "gris";
	children: ReactNode;
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
}

export const Boton = (props: Props) => {
	const colorClasses =
		props.color === "gris"
			? "text-gray-400 border-gray-400 hover:bg-gray-100"
			: "text-slate-900 border-slate-900 hover:bg-yellow-200";

	const disabledClasses = props.disabled ? "opacity-50 cursor-not-allowed" : "";

	if (props.sinBorde)
		return (
			<button
				onClick={props.disabled ? undefined : props.onClick}
				disabled={props.disabled}
				className={`text-slate-900 hover:bg-gray-100 ${
					props.chiquito ? "h-6 px-2 text-xs" : "h-10 px-4 text-sm"
				} font-medium rounded ${disabledClasses} ${props.className}`}
			>
				{props.children}
			</button>
		);
	else if (props.soloBorde)
		return (
			<button
				onClick={props.disabled ? undefined : props.onClick}
				disabled={props.disabled}
				className={`${colorClasses} border ${
					props.chiquito ? "h-6 px-2 text-xs" : "h-10 px-4 text-sm"
				} font-medium rounded ${disabledClasses} ${props.className}`}
			>
				{props.children}
			</button>
		);
	else
		return (
			<button
				onClick={props.disabled ? undefined : props.onClick}
				disabled={props.disabled}
				className={`bg-slate-900 hover:bg-yellow-200 hover:text-slate-900 hover:border-black hover:border text-white font-semibold ${
					props.chiquito ? "py-1 px-2 text-xs" : "py-2 px-4"
				} rounded ${disabledClasses} ${props.className}`}
			>
				{props.children}
			</button>
		);
};

export const BotonIcono = (props: Props) => {
	const disabledClasses = props.disabled ? "opacity-50 cursor-not-allowed" : "";

	return (
		<button
			onClick={props.disabled ? undefined : props.onClick}
			disabled={props.disabled}
			className={`bg-slate-900 hover:bg-yellow-200 hover:text-slate-900 hover:border-black hover:border text-white font-bold rounded-full h-10 w-10 pl-1 ${disabledClasses} ${props.className}`}
		>
			{props.children}
		</button>
	);
};
