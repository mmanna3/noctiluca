interface Props {
	ocultarSemanaActual: boolean;
}

const HabitTrackerPlaceholder = ({ ocultarSemanaActual }: Props) => {
	if (ocultarSemanaActual) {
		return (
			<div className='mb-4 min-h-[88px]' aria-hidden='true'>
				<div className='h-16 rounded-lg bg-gray-100 animate-pulse' />
			</div>
		);
	}

	return (
		<div className='mb-6 pb-4 border-b border-gray-200 min-h-[188px]' aria-hidden='true'>
			<div className='flex items-center justify-between mb-2'>
				<div className='h-6 w-6 rounded bg-gray-100 animate-pulse' />
				<div className='h-4 w-24 rounded bg-gray-100 animate-pulse' />
				<div className='h-6 w-6 rounded bg-gray-100 animate-pulse' />
			</div>
			<div className='flex gap-1 mb-3'>
				{Array.from({ length: 7 }).map((_, i) => (
					<div key={i} className='h-7 w-11 rounded-md bg-gray-100 animate-pulse flex-shrink-0' />
				))}
			</div>
			<div className='h-16 rounded-lg bg-gray-100 animate-pulse' />
		</div>
	);
};

export default HabitTrackerPlaceholder;
