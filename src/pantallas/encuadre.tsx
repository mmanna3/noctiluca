import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

const IndicadorSync = React.lazy(() => import("../components/indicador-sync"));

const Encuadre = () => {
	return (
		<div className='min-h-dvh flex flex-col pt-[env(safe-area-inset-top)]'>
			<div className='container mx-auto max-w-4xl w-full md:px-8 px-5'>
				<Suspense fallback={null}>
					<IndicadorSync />
				</Suspense>
			</div>
			<main className='container mx-auto max-w-4xl md:px-8 px-5 pt-1 md:pt-2 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] md:pb-[calc(2rem+env(safe-area-inset-bottom,0px))] flex-1 flex flex-col'>
				<Outlet />
			</main>
		</div>
	);
};
export default Encuadre;
