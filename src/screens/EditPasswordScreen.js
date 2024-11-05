import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, updateDoc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

// Función para verificar la fortaleza de la contraseña
const checkPasswordStrength = (password) => {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()]/.test(password);
  const minLength = password.length >= 8;

  return minLength && hasLower && hasUpper && hasNumber && hasSpecial;
};

const EditPasswordScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { passwordId } = route.params || {};
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const fetchPasswordDetail = async () => {
      try {
        const userId = auth.currentUser.uid;
        const passwordRef = doc(db, 'users', userId, 'passwords', passwordId);
        const passwordDoc = await getDoc(passwordRef);

        if (passwordDoc.exists()) {
          const data = passwordDoc.data();
          setWebsite(data.sitio_web || '');
          setUsername(data.usuario || '');
          setPassword(data.contraseña || '');
          setOriginalData(data);
        } else {
          Alert.alert('Error', 'No se encontró la contraseña.');
        }
      } catch (error) {
        console.error('Error al cargar los detalles de la contraseña: ', error);
      }
    };

    fetchPasswordDetail();
  }, [passwordId]);

  const handleSave = async () => {
    if (
      website === originalData.sitio_web &&
      username === originalData.usuario &&
      password === originalData.contraseña
    ) {
      Alert.alert('No se realizaron cambios.');
      navigation.goBack();
      return;
    }

    const isStrong = checkPasswordStrength(password);
    const userId = auth.currentUser.uid;
    const passwordRef = doc(db, 'users', userId, 'passwords', passwordId);

    await updateDoc(passwordRef, {
      sitio_web: website,
      usuario: username,
      contraseña: password,
      fuerte: isStrong, // Actualiza el campo `fuerte` según la fortaleza de la contraseña
      lastModified: new Date(),
    });
    Alert.alert('Cambios guardados correctamente.');
    navigation.goBack();
  };

  const handleDelete = async () => {
    try {
      const userId = auth.currentUser.uid;
      const passwordRef = doc(db, 'users', userId, 'passwords', passwordId);
      const passwordDoc = await getDoc(passwordRef);
      const passwordData = passwordDoc.data();

      await setDoc(doc(db, 'users', userId, 'eliminadas', passwordId), passwordData);
      await deleteDoc(passwordRef);

      Alert.alert('Eliminada', 'La contraseña ha sido movida a "Eliminadas".');
      navigation.goBack();
    } catch (error) {
      console.error('Error al eliminar la contraseña:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar la contraseña.');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Sitio Web"
        style={styles.input}
        value={website}
        onChangeText={setWebsite}
      />
      <TextInput
        placeholder="Nombre de Usuario"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>GUARDAR CAMBIOS</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: '#64C466',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#007BFF',
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditPasswordScreen;
