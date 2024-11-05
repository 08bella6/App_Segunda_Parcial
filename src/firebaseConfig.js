// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase obtenida desde tu proyecto en Firebase Console
const firebaseConfig = {
  apiKey: 'AIzaSyC_pkmgShQPqxmdPfuhbKUezlhdiQcGpB8',
  authDomain: 'passwordapp-7b709.firebaseapp.com',
  projectId: 'passwordapp-7b709',
  storageBucket: 'passwordapp-7b709.appspot.com',
  messagingSenderId: '504157659170',
  appId: '1:504157659170:android:28e004f72c6704b44caa7b',
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
