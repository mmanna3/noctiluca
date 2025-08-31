import { ReactNode } from "react";

interface CardProps {
	children: ReactNode;
	className?: string;
}

interface CardHeaderProps {
	children: ReactNode;
	className?: string;
}

interface CardTitleProps {
	children: ReactNode;
	className?: string;
}

interface CardContentProps {
	children: ReactNode;
	className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
	return (
		<div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
			{children}
		</div>
	);
};

export const CardHeader = ({ children, className = "" }: CardHeaderProps) => {
	return <div className={`p-6 pb-0 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className = "" }: CardTitleProps) => {
	return <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>;
};

export const CardContent = ({ children, className = "" }: CardContentProps) => {
	return <div className={`p-6 pt-4 ${className}`}>{children}</div>;
};
