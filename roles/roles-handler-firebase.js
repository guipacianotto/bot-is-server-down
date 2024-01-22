import FirebaseHandler from "../firebase/firebase-connector.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default class RolesHandlerFirebase {

    static instance;
    static firestore;
    static roles;

    constructor() {
        if(!this.instance) {
            this.firestore = this.initializeFireStore();
            this.roles = this.fetchRoles().then((result) => {
                return result;
            });
            console.log("firestore intialized: ", this.firestore);
        }
        
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new RolesHandlerFirebase();
        }

        return this.instance;
    }

    initializeFireStore() {
        const fbHandler = FirebaseHandler.getInstance();

        const fbApp = fbHandler.getFirebaseConnection();

        return getFirestore(fbApp);
    }

    async fetchRoles() {
        const firestore = this.firestore;


        const docRef = doc(firestore, "rub-scopes", "discord-scopes");

        const data = await getDoc(docRef);

        return data.data();
    }

    getRoles() {
        return this.roles;
    }
}