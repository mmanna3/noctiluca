import { CarpetaDTO, PropositoCarpetaEnum } from "@/api/clients";
import EditorListaObjetivos from "./editor-lista-objetivos";

interface Props {
	carpetas?: CarpetaDTO[];
}

const ObjetivosDiaWidget = ({ carpetas }: Props) => {
	const carpetaDia = carpetas
		?.flatMap((c) => [c, ...(c.subCarpetas ?? [])])
		.find((c) => c.propositoCarpeta === PropositoCarpetaEnum._2);

	return (
		<EditorListaObjetivos
			modoDia
			fecha={new Date()}
			enlaceHistorico={
				carpetaDia?.id
					? { carpetaId: carpetaDia.id, etiqueta: "Ver histórico →" }
					: undefined
			}
		/>
	);
};

export default ObjetivosDiaWidget;
