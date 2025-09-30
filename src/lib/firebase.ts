
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCdQTzZgc4U_Dqtg4MgOdARrlO_xoR5qaU",
  authDomain: "studio-1309829572-d62fc.firebaseapp.com",
  projectId: "studio-1309829572-d62fc",
  storageBucket: "studio-1309829572-d62fc.appspot.com",
  messagingSenderId: "263758338013",
  appId: "1:263758338013:web:20722bc3ab9823a4df4834"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
