export interface IEscrito {
	id: string;
	titulo: string;
	cuerpo: string;
	fechaHora: string;
}

export interface ICarpeta {
	titulo: string;
	escritos: any;
}