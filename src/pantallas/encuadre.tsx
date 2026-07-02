import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

const IndicadorSync = React.lazy(() => import("../components/indicador-sync"));

const Encuadre = () => {
	return (
		<div className='min-h-dvh flex flex-col pt-[env(safe-area-inset-top)]'>
			<Suspense fallback={null}>
				<IndicadorSync />
			</Suspense>
			<main className='container mx-auto max-w-4xl md:px-8 px-5 py-4 md:py-8 flex-1 flex flex-col pb-[env(safe-area-inset-bottom)]'>
				<Outlet />
			</main>
		</div>
	);
};
export default Encuadre;
