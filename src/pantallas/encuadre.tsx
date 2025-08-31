import { Outlet } from "react-router-dom";

const Encuadre = () => {
	return (
		<div className='min-h-screen'>
			<main className='container mx-auto max-w-4xl md:px-8 py-8 px-5'>
				<Outlet />
			</main>
		</div>
	);
};
export default Encuadre;
