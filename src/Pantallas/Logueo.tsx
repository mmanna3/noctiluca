import { useEffect, useState } from "react";
import * as firebaseui from "firebaseui";
import firebase from "firebase/compat/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {auth} from "./../firebase";


function Logueo() {
	useEffect(() => {
		const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

		ui.start(".firebase-auth-container", {
			signInOptions: [
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			],
			signInSuccessUrl: "/autenticado",		
			signInFlow: "popup",	
		});
	}, []);

	useEffect(()=>{		
		auth.onAuthStateChanged((user)=> {
			console.log("usuario", user);		
		});
	}, []);

	return (
		<div style={{ textAlign: "center"}}>
			<h1>Noctiluca</h1>
			<div className="firebase-auth-container"></div>
		</div>
	);
}

export default Logueo;