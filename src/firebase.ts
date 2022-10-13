import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child, set, onValue, DataSnapshot, update, remove } from "firebase/database";
import "firebase/compat/auth";
import { IEscrito, ICarpeta } from "./Interfaces";
import { convertirEnKey } from "./utilidades";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyBQ2dWi6V3z16oNPiCOyq1Yh55P_R1wWWk",
	authDomain: "backend-mandarina.firebaseapp.com",
	databaseURL: "https://backend-mandarina-default-rtdb.firebaseio.com",
	projectId: "backend-mandarina",
	storageBucket: "backend-mandarina.appspot.com",
	messagingSenderId: "928506352172",
	appId: "1:928506352172:web:c21a80e46354d27aab7789",
	measurementId: "G-BGBTGH5FQR",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export const auth = getAuth(app);

export function crearEscrito(carpetaId: string, titulo: string, cuerpo: string) {
	const ahora = new Date();
	
	set(ref(db, `${carpetaId}/` + convertirEnKey(titulo)), {
		titulo: titulo,
		cuerpo: cuerpo,
		fechaHora: ahora.toISOString(),
	});
}

export function crearCarpeta(carpetaId: string) {
	const dbRef = ref(db, convertirEnKey(carpetaId));
	get(dbRef).then((snapshot) => {
		if (snapshot.exists()) {
			console.log("Se encontró la carpeta así que no se creó");
		} else {
			set(ref(db, `${convertirEnKey(carpetaId)}/`), ""); 
		}
	  }).catch((error) => {
		console.error(error);
	  });
}

function compararFechas(a: IEscrito, b: IEscrito) {
	const fechaHoraA = new Date(a.fechaHora);
	const fechaHoraB = new Date(b.fechaHora);

	if (fechaHoraA < fechaHoraB) return 1;
	if (fechaHoraA > fechaHoraB) return -1;
	return 0;
}

export const escucharEscritos = (carpetaId: string, callback: (data: IEscrito[]) => void) => {	
	const dbRef = ref(db, carpetaId);
	onValue(dbRef, (snapshot: DataSnapshot) => {
		const resultado: IEscrito[] = [];
		
		snapshot.forEach((child) => {
			resultado.push({...child.val(), id: child.key} as unknown as IEscrito);
		});
		
		resultado.sort(compararFechas);

		callback(resultado);
	});
};

export const escucharCarpetas = (callback: (data: ICarpeta[]) => void) => {	
	const dbRef = ref(db, "/");
	onValue(dbRef, (snapshot: DataSnapshot) => {
		const resultado: ICarpeta[] = [];
		snapshot.forEach((child) => {
			if (child && child.key) {
				resultado.push({"titulo": child.key, "escritos": child.val()});
			}	
		});

		callback(resultado);
	});
};

export const obtenerEscrito = (carpetaId: string, id: string, callback: (data: IEscrito) => void) => {
	const dbRef = ref(db, carpetaId);
	get(child(dbRef, id)).then((snapshot) => {
		if (snapshot.exists()) {
		  console.log(snapshot.val());
		  callback(snapshot.val());
		} else {
		  console.log("No se encontró el escrito");
		}
	  }).catch((error) => {
		console.error(error);
	  });
};

export const editarEscrito = (carpetaId: string, escrito: IEscrito) => {
	const dbRef = ref(db, carpetaId);
	const updates: any = {};
	const ahora = new Date();

	updates[`/${escrito.id}`] = {
		titulo: escrito.titulo,
		cuerpo: escrito.cuerpo,
		fechaHora: ahora.toISOString(),
	};

	return update(dbRef, updates);
};

export const eliminarEscrito = (carpetaId: string, id: string) => {
	const dbRef = ref(db, `${carpetaId}/${id}`);
	return remove(dbRef);
};