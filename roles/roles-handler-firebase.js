//@ts-check
import FirebaseHandler from "../firebase/firebase-connector.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default class RolesHandlerFirebase {
    /**
     * @type {RolesHandlerFirebase}
     */
    static instance;
    /**
     * @type {any}
     */
    static firestore;
    /**
     * @type {any}
     */
    static roles;

    constructor() {
        if (!RolesHandlerFirebase.instance) {
            this.firestore = this.initializeFireStore();
            this.roles = this.fetchRoles().then(result => {
                return result;
            });
            console.log("firestore intialized: ", this.firestore);
        }
    }

    static getInstance() {
        if (!this.instance) {
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

        //@ts-ignore
        const docRef = doc(firestore, "rub-scopes", "discord-scopes");

        const data = await getDoc(docRef);

        return data.data();
    }

    getRoles() {
        return this.roles;
    }

    /**
     * @param {string} guild_id
     */
    async fetchRolesByGuild(guild_id) {
        const firestore = this.firestore;

        //@ts-ignore
        const docRef = doc(firestore, "rub-scopes", guild_id);

        const data = await getDoc(docRef);

        return data.data();
    }
}
