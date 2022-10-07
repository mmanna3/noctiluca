// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child, set, onValue } from "firebase/database";
import { convertirASnakeCase } from "./utilidades";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export function crearEscrito(titulo: string, cuerpo: string) {
	const ahora = new Date();
	
	set(ref(db, "escritos/" + convertirASnakeCase(titulo)), {
		titulo: titulo,
		cuerpo: cuerpo,
		fechaHora: ahora.toISOString(),
	});
}

export const escucharEscritos = (callback: (data: any) => void) => {
	const starCountRef = ref(db, "escritos");
	onValue(starCountRef, (snapshot: any) => {
		const data = snapshot.val();
		// updateStarCount(postElement, data);
		callback(data);
	});
};

export const obtenerEscrito = (id: string, callback: (data: any) => void) => {
	const dbRef = ref(db, "escritos");
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