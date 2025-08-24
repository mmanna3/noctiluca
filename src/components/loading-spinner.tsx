interface LoadingSpinnerProps {
	className?: string;
}

export const LoadingSpinner = ({ className = "" }: LoadingSpinnerProps) => {
	return (
		<svg
			className={`animate-spin ${className}`}
			width='16'
			height='16'
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<circle
				cx='12'
				cy='12'
				r='10'
				stroke='currentColor'
				strokeWidth='4'
				strokeLinecap='round'
				strokeDasharray='31.416'
				strokeDashoffset='31.416'
				className='opacity-25'
			/>
			<path
				d='M4.93 4.93L4.93 4.93A10 10 0 0 1 12 2v10'
				stroke='currentColor'
				strokeWidth='4'
				strokeLinecap='round'
				className='opacity-75'
			/>
		</svg>
	);
};
