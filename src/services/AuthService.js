import { auth, db } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, collection, addDoc, getDocs, query, deleteDoc } from 'firebase/firestore';

// Registro de usuario
export const registerUser = async (email, password, name, apellido) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Crear un documento para el usuario en Firestore
    await setDoc(doc(db, 'users', userId), {
      email: email,
      nombre: name,
      apellido: apellido,
      createdAt: new Date(),
    });

    console.log('Usuario registrado y datos guardados en Firestore');
  } catch (error) {
    console.error('Error al registrar el usuario:', error.message);
    throw error;
  }
};

// Guardar contraseñas en la subcolección 'passwords'
export const savePassword = async (userId, passwordData) => {
  try {
    await addDoc(collection(db, 'users', userId, 'passwords'), passwordData);
    console.log('Contraseña guardada correctamente');
  } catch (error) {
    console.error('Error al guardar la contraseña:', error.message);
    throw error;
  }
};

// Obtener contraseñas
export const getPasswords = async (userId) => {
  try {
    const passwordsQuery = query(collection(db, 'users', userId, 'passwords'));
    const querySnapshot = await getDocs(passwordsQuery);
    const passwords = querySnapshot.docs.map(doc => doc.data());
    return passwords;
  } catch (error) {
    console.error('Error al obtener las contraseñas:', error.message);
    throw error;
  }
};

// Iniciar sesión
export const loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log('Usuario ha iniciado sesión');
  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      console.error('Contraseña incorrecta');
    } else if (error.code === 'auth/user-not-found') {
      console.error('Usuario no encontrado');
    } else {
      console.error('Error al iniciar sesión:', error.message);
    }
    throw error;
  }
};

// Cerrar sesión
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('Usuario ha cerrado sesión');
  } catch (error) {
    console.error('Error al cerrar sesión: ', error);
    throw error;
  }
};

// Restablecer contraseña
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Correo de restablecimiento de contraseña enviado');
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error('Usuario no encontrado');
    } else {
      console.error('Error al enviar el correo:', error.message);
    }
    throw error;
  }
};

// Estado de autenticación
export const onAuthStateChanged = (callback) => {
  return firebaseOnAuthStateChanged(auth, callback);
};


// =======================
// Funciones para Wi-Fi
// =======================

// Guardar referencia de red Wi-Fi en Firestore
export const saveWifiNetwork = async (userId, wifiData) => {
  try {
    const wifiRef = collection(db, 'users', userId, 'wifi'); // Reference to 'wifi' collection
    await addDoc(wifiRef, wifiData); // Automatically generates a unique ID for each network
    console.log('Red Wi-Fi guardada correctamente');
  } catch (error) {
    console.error('Error al guardar la red Wi-Fi:', error.message);
    throw error;
  }
};

// Obtener redes Wi-Fi
export const getWifiNetworks = async (userId) => {
  try {
    const wifiQuery = query(collection(db, 'users', userId, 'wifi'));
    const querySnapshot = await getDocs(wifiQuery);
    const networks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return networks;
  } catch (error) {
    console.error('Error al obtener las redes Wi-Fi:', error.message);
    throw error;
  }
};

// Obtener detalle de red Wi-Fi específica
export const getWifiNetworkDetail = async (userId, wifiId) => {
  try {
    const wifiRef = doc(db, 'users', userId, 'wifi', wifiId);
    const wifiDoc = await getDoc(wifiRef);
    if (wifiDoc.exists()) {
      return { id: wifiDoc.id, ...wifiDoc.data() };
    } else {
      console.log('No se encontró la red Wi-Fi');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el detalle de la red Wi-Fi:', error.message);
    throw error;
  }
};

// Eliminar red Wi-Fi
export const deleteWifiNetwork = async (userId, wifiId) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'wifi', wifiId));
    console.log('Red Wi-Fi eliminada correctamente');
  } catch (error) {
    console.error('Error al eliminar la red Wi-Fi:', error.message);
    throw error;
  }
};
