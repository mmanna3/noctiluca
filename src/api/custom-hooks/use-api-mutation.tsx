import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface IProps<T> {
	fn: (args: T) => Promise<unknown>;
	mensajeDeExito?: string;
	antesDeMensajeExito?: () => void;
	despuesDeExito?: () => void;
	mensajeDeError?: string;
	invalidarQueries?: QueryKey[];
}

const useApiMutation = <T,>({
	fn,
	mensajeDeExito = "Operación exitosa",
	antesDeMensajeExito = () => undefined,
	despuesDeExito = () => undefined,
	mensajeDeError = "Ocurrió un error inesperado",
	invalidarQueries,
}: IProps<T>) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (args: T) => {
			return fn(args);
		},
		onError: (error: unknown) => {
			console.error("Error en la mutación:", error);

			const mensaje =
				error instanceof Error
					? JSON.parse((error as unknown as { response: string }).response).title
					: mensajeDeError;

			toast.error(mensaje);
		},
		onSuccess: async () => {
			if (invalidarQueries?.length) {
				await Promise.all(
					invalidarQueries.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
				);
			}
			antesDeMensajeExito();
			toast.success(mensajeDeExito);
			despuesDeExito();
		},
	});

	return mutation;
};

export default useApiMutation;
