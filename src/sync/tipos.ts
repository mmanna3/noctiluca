export type TipoEntidadSync = "escrito" | "carpeta";

export type OperacionSync = "upsert" | "delete";

/** Operación pendiente en el outbox, esperando ser enviada al servidor. */
export interface OperacionOutbox {
	clientOpId: string;
	entityType: TipoEntidadSync;
	operation: OperacionSync;
	clientEntityId: string;
	baseVersion?: number;
	clientTimestamp: string;
	payload: unknown;
	intentos: number;
	/** Marcada como fallo permanente (ej. validación 4xx): no se reintenta sola. */
	muerta?: boolean;
}

/** Copia local de un escrito (fuente de verdad offline). */
export interface EscritoLocal {
	clientId: string;
	serverId?: number;
	titulo: string;
	cuerpo: string;
	carpetaClientId?: string;
	carpetaId?: number;
	version: number;
	actualizadoEn?: string;
	estaEnPapelera?: boolean;
	/** Tiene cambios locales aún no confirmados por el servidor. */
	pendiente?: boolean;
}

/** Copia local de una carpeta. */
export interface CarpetaLocal {
	clientId: string;
	serverId?: number;
	titulo: string;
	version: number;
	carpetaPadreClientId?: string;
	posicion?: number;
}

export type EstadoGuardado = "guardado" | "guardando" | "pendiente" | "sin-conexion" | "error";
