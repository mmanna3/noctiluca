import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext";

import { Card, CardContent } from "../components/card";
import { Input } from "../components/input-ui";
import { LoadingSpinner } from "../components/loading-spinner";
import { useAuth } from "../hooks/use-auth";

export default function Login() {
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const { login } = useAuth();
	const { cambiarEstado } = useAppContext();

	const from = location.state?.from?.pathname || "/";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const success = await login("mana", password);
			if (success) {
				cambiarEstado({ fechaHoraQueIngresoElPassword: new Date().toString() });
				navigate(from, { replace: true });
			} else {
				setError("Usuario o contraseña incorrectos");
			}
		} catch {
			setError("Error al intentar iniciar sesión");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<Card className='w-[350px]'>
				<CardContent>
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='space-y-2'>
							<Input
								id='password'
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								disabled={isLoading}
							/>
						</div>
						{error && <div className='text-sm text-red-500 text-center'>{error}</div>}
						<button
							type='submit'
							disabled={isLoading}
							className='w-full hover:bg-yellow-200 text-slate-900 border-slate-900 border h-10 px-4 text-sm font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
						>
							{isLoading ? (
								<>
									<LoadingSpinner className='' />
								</>
							) : (
								"!"
							)}
						</button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
