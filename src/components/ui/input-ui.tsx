import { ChangeEvent } from "react";

interface InputProps {
	id?: string;
	type?: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
	disabled?: boolean;
	className?: string;
}

export const Input = ({
	id,
	type = "text",
	value,
	onChange,
	required = false,
	disabled = false,
	className = "",
}: InputProps) => {
	return (
		<input
			id={id}
			type={type}
			value={value}
			onChange={onChange}
			required={required}
			disabled={disabled}
			className={`border-b text-slate-900 w-full text-lg px-2 py-2 font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
		/>
	);
};
