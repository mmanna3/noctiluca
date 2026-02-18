import Input from "../../components/ui/input";
import Textarea from "../../components/ui/textarea";

interface Props {
	titulo: string;
	cuerpo: string;
	onCambiarTitulo: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onCambiarCuerpo: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CuerpoEscrito = ({ titulo, cuerpo, onCambiarTitulo, onCambiarCuerpo }: Props) => (
	<>
		<Input
			valor={titulo}
			sinBorde
			autoFocus
			placeholder='Título'
			textoReGrande
			cuandoCambie={onCambiarTitulo}
		/>
		<div className='pt-2'>
			<Textarea
				valor={cuerpo}
				sinBorde
				placeholder='Texto'
				cuandoCambie={onCambiarCuerpo}
			/>
		</div>
	</>
);

export default CuerpoEscrito;
