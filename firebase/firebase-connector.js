import {initializeApp} from 'firebase/app'

export default class FirebaseHandler {

    static instance;
    static firebaseApp;

    constructor() {
        if(!this.instance) {
            this.instance = null;
            this.firebaseApp = this.connectFirebase();
        }
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new FirebaseHandler();
        }

        return this.instance;
    }

    getCredentials() {
        return {
            apiKey: process.env.FIREBASE_API_KEY,      
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,      
            projectId: process.env.FIREBASE_PROJECT_ID,      
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,      
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,      
            appId: process.env.FIREBASE_APP_ID
        }
    }

    connectFirebase() {
        const credentials = this.getCredentials();
        this.firebaseApp = initializeApp(credentials)
        console.log("Firebase connected: ", this.firebaseApp);
        return this.firebaseApp;
    }

    getFirebaseConnection() {
        return this.firebaseApp;
    }
}