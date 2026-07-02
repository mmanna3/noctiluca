import { api } from "@/api/api";
import useApiMutation from "@/api/custom-hooks/use-api-mutation";
import useApiQuery from "@/api/custom-hooks/use-api-query";
import { HabitoDTO, TipoHabitoEnum } from "@/api/clients";
import { clavesHabitos, queryKeys } from "@/api/query-keys";
import { ChevronLeftIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Boton, BotonIcono } from "@/components/ui/botones";
import AvisoSoloOnline from "@/components/ui/aviso-solo-online";
import Cuerpo from "@/components/ui/cuerpo";
import Encabezado from "@/components/ui/encabezado";
import Input from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useEstadoSync } from "@/sync/estado-sync";
import usarNavegacion from "@/usar-navegacion";
import { esHabitoNumerico, MAX_HABITOS_ACTIVOS } from "./utilidades-habitos";

const FormularioHabito = ({
	habitoInicial,
	onCancelar,
	onGuardado,
	soloLectura,
}: {
	habitoInicial?: HabitoDTO;
	onCancelar: () => void;
	onGuardado: () => void;
	soloLectura?: boolean;
}) => {
	const [nombre, setNombre] = useState(habitoInicial?.nombre ?? "");
	const [tipo, setTipo] = useState<TipoHabitoEnum>(
		habitoInicial?.tipo ?? TipoHabitoEnum._1,
	);
	const [metaMinutos, setMetaMinutos] = useState(
		String(habitoInicial?.metaMinutos ?? 1),
	);
	const [activo, setActivo] = useState(habitoInicial?.activo ?? true);
	const [error, setError] = useState("");

	const esEdicion = habitoInicial?.id != null && habitoInicial.id > 0;

	const guardar = useApiMutation({
		fn: async () => {
			const dto = new HabitoDTO({
				id: habitoInicial?.id ?? 0,
				nombre: nombre.trim(),
				tipo,
				activo,
				posicion: habitoInicial?.posicion ?? 0,
				metaMinutos: esHabitoNumerico(tipo) ? parseInt(metaMinutos, 10) || 1 : undefined,
			});

			if (esEdicion) {
				await api.habitoPUT(habitoInicial!.id!, dto);
			} else {
				await api.habitoPOST(dto);
			}
		},
		mensajeDeExito: esEdicion ? "Hábito actualizado" : "Hábito creado",
		antesDeMensajeExito: onGuardado,
		invalidarQueries: clavesHabitos,
	});

	const submit = () => {
		if (soloLectura) return;
		if (!nombre.trim()) {
			setError("El nombre es obligatorio");
			return;
		}
		if (nombre.trim().length > 50) {
			setError("Máximo 50 caracteres");
			return;
		}
		guardar.mutate(undefined as never);
	};

	return (
		<div className='border border-gray-200 rounded-lg p-4 mb-4 space-y-3'>
			<Input
				valor={nombre}
				autoFocus
				placeholder='Nombre del hábito'
				cuandoCambie={(e) => {
					setNombre(e.target.value);
					setError("");
				}}
				hayError={error.length > 0}
				mensajeError={error}
			/>

			<div>
				<label className='text-sm text-gray-600'>Tipo</label>
				<select
					value={tipo}
					onChange={(e) => setTipo(Number(e.target.value) as TipoHabitoEnum)}
					className='w-full border-b py-2 text-lg focus:outline-none'
				>
					<option value={TipoHabitoEnum._1}>Sí / No</option>
					<option value={TipoHabitoEnum._2}>Numérico (minutos)</option>
				</select>
			</div>

			{esHabitoNumerico(tipo) && (
				<div>
					<label className='text-sm text-gray-600'>Meta diaria (minutos)</label>
					<input
						type='number'
						min={1}
						value={metaMinutos}
						onChange={(e) => setMetaMinutos(e.target.value)}
						className='w-full border-b py-2 text-lg focus:outline-none'
					/>
				</div>
			)}

			<label className='flex items-center gap-2 text-sm'>
				<input
					type='checkbox'
					checked={activo}
					onChange={(e) => setActivo(e.target.checked)}
				/>
				Activo
			</label>

			<div className='flex gap-2'>
				<Boton onClick={submit} disabled={guardar.isPending || soloLectura}>
					{esEdicion ? "Guardar" : "Crear"}
				</Boton>
				<Boton soloBorde onClick={onCancelar}>
					Cancelar
				</Boton>
			</div>
		</div>
	);
};

const AdministrarHabitos = () => {
	const { irAlInicio } = usarNavegacion();
	const online = useEstadoSync((s) => s.online);
	const [mostrarFormulario, setMostrarFormulario] = useState(false);
	const [habitoEditando, setHabitoEditando] = useState<HabitoDTO | undefined>();

	const { data, isLoading } = useApiQuery({
		key: queryKeys.habitos,
		fn: () => api.habitoAll(),
	});

	const eliminar = useApiMutation({
		fn: (id: number) => api.habitoDELETE(id),
		mensajeDeExito: "Hábito eliminado",
		invalidarQueries: clavesHabitos,
	});

	const desactivar = useApiMutation({
		fn: async (habito: HabitoDTO) => {
			await api.habitoPUT(
				habito.id!,
				new HabitoDTO({
					id: habito.id,
					nombre: habito.nombre,
					tipo: habito.tipo,
					activo: false,
					posicion: habito.posicion,
					metaMinutos: habito.metaMinutos,
				}),
			);
		},
		mensajeDeExito: "Hábito desactivado",
		invalidarQueries: clavesHabitos,
	});

	const alGuardar = () => {
		setMostrarFormulario(false);
		setHabitoEditando(undefined);
	};

	const habitosActivos = data?.filter((h) => h.activo).length ?? 0;
	const puedeCrearActivo = habitosActivos < MAX_HABITOS_ACTIVOS;

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-full'>
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<>
			<Encabezado>
				<Boton soloBorde className='flex items-center' onClick={irAlInicio}>
					<ChevronLeftIcon className='w-4 h-4 mr-2' />
					Hábitos
				</Boton>
				<BotonIcono
					onClick={() => {
						if (!online) return;
						setHabitoEditando(undefined);
						setMostrarFormulario(true);
					}}
					disabled={!online}
				>
					<PlusIcon className='h-8 w-8' />
				</BotonIcono>
			</Encabezado>
			<Cuerpo>
				{!online && (
					<AvisoSoloOnline
						className='mb-4'
						mensaje='Administrar hábitos requiere conexión a internet.'
					/>
				)}
				<p className='text-sm text-gray-500 mb-4'>
					{habitosActivos}/{MAX_HABITOS_ACTIVOS} hábitos activos
					{!puedeCrearActivo && " (límite alcanzado)"}
				</p>

				{(mostrarFormulario || habitoEditando) && (
					<FormularioHabito
						habitoInicial={habitoEditando}
						soloLectura={!online}
						onCancelar={() => {
							setMostrarFormulario(false);
							setHabitoEditando(undefined);
						}}
						onGuardado={alGuardar}
					/>
				)}

				<ul className='space-y-3'>
					{data?.map((habito) => {
						const tieneRegistros = (habito.cantidadRegistros ?? 0) > 0;
						const tipoLabel = esHabitoNumerico(habito.tipo) ? "Numérico" : "Sí/No";

						return (
							<li
								key={habito.id}
								className={`border rounded-lg p-3 ${habito.activo ? "border-gray-200" : "border-gray-100 bg-gray-50 opacity-70"}`}
							>
								<div className='flex justify-between items-start'>
									<div>
										<p className='font-medium'>{habito.nombre}</p>
										<p className='text-xs text-gray-500'>
											{tipoLabel}
											{esHabitoNumerico(habito.tipo) &&
												` · meta ${habito.metaMinutos ?? 1} min`}
											{!habito.activo && " · inactivo"}
										</p>
									</div>
									<div className='flex gap-1'>
										<button
											type='button'
											onClick={() => {
												if (!online) return;
												setHabitoEditando(habito);
												setMostrarFormulario(false);
											}}
											disabled={!online}
											className='text-xs text-gray-600 hover:text-gray-900 px-2 py-1 disabled:opacity-40'
										>
											Editar
										</button>
										{habito.activo && (
											<button
												type='button'
												onClick={() => online && desactivar.mutate(habito)}
												disabled={!online}
												className='text-xs text-amber-600 hover:text-amber-800 px-2 py-1 disabled:opacity-40'
											>
												Desactivar
											</button>
										)}
										<button
											type='button'
											onClick={() => online && habito.id && eliminar.mutate(habito.id)}
											disabled={!online || tieneRegistros}
											title={
												tieneRegistros
													? "No se puede eliminar un hábito con registros"
													: "Eliminar"
											}
											className='p-1 disabled:opacity-30 disabled:cursor-not-allowed'
										>
											<TrashIcon className='w-4 h-4 text-red-500' />
										</button>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			</Cuerpo>
		</>
	);
};

export default AdministrarHabitos;
