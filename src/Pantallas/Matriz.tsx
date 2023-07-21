import { Outlet } from "react-router-dom";

const Matriz = () => {
	return (
		<div className="min-h-screen">
			<main className="container mx-auto max-w-4xl p-8">
				<Outlet />
			</main>
		</div>
	);
};
export default Matriz;