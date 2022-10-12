import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { auth } from "../firebase";
import firebase from "firebase/compat/app";

function Logueo() {
	const uiConfig = {
		signInFlow: "popup",
		signInOptions: [
			firebase.auth.EmailAuthProvider.PROVIDER_ID,
		],
	};

	return (
		<div style={{ textAlign: "center"}}>
			<h1>Noctiluca</h1>
			<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
		</div>
	);
}

export default Logueo;