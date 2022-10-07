// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
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
  measurementId: "G-BGBTGH5FQR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export default getDatabase(app);

export const convertirASnakeCase = 
  (txt: string) => txt.toLowerCase()
                      .replace(/[^a-z0-9 áéíóúÁÉÍÓÚ]/gi, '')
                      .replace(/ /g,"_");

export function crearEscrito(titulo: string, cuerpo: string) {
  const db = getDatabase(app);
  // set(ref(db, 'escritos/' + userId), {
  set(ref(db, 'escritos/'+ convertirASnakeCase(titulo)), {
    titulo: titulo,
    cuerpo: cuerpo,
    fechaHora: new Date().toISOString()
  });
}