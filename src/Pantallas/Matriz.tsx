import { Outlet } from "react-router-dom";

const Matriz = () => {
	return (
		<>
			<main className="container mx-auto max-w-4xl">
				<Outlet />
			</main>
		</>
	);
};
export default Matriz;