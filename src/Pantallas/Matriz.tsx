import { Outlet } from "react-router-dom";

const Matriz = () => {
	return (
		<div className="min-h-screen">
			<main className="container mx-auto max-w-4xl md:p-6 p-3">
				<Outlet />
			</main>
		</div>
	);
};
export default Matriz;