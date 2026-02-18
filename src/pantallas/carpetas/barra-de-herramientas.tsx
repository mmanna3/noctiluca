import { CriterioDeOrdenEnum } from "@/api/clients";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import { Boton } from "../../components/ui/botones";
import SelectorCriterioOrden from "../../components/ui/selector-criterio-orden";

interface Props {
	mostrar: boolean;
	onToggle: () => void;
	criterioActual: CriterioDeOrdenEnum;
	tieneEscritos: boolean;
	actualizandoCriterio: boolean;
	onCambiarCriterio: (criterio: CriterioDeOrdenEnum) => void;
}

const BarraDeHerramientas = ({
	mostrar,
	onToggle,
	criterioActual,
	tieneEscritos,
	actualizandoCriterio,
	onCambiarCriterio,
}: Props) => (
	<div className='flex items-center gap-2 mt-1 ml-[-12px]'>
		<Boton sinBorde onClick={onToggle}>
			<AdjustmentsHorizontalIcon className='h-4 w-4' />
		</Boton>
		{mostrar && (
			<div className='flex items-center gap-2'>
				{tieneEscritos && (
					<SelectorCriterioOrden
						valor={criterioActual}
						onChange={onCambiarCriterio}
						disabled={actualizandoCriterio}
					/>
				)}
			</div>
		)}
	</div>
);

export default BarraDeHerramientas;
