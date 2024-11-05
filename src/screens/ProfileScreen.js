import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, Image } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false); // Modo edición
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (userId) {
          const userRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setNombre(data.nombre);
            setApellido(data.apellido);
          } else {
            Alert.alert('Error', 'No se encontró la información del usuario.');
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos del perfil: ', error);
        Alert.alert('Error', 'Hubo un problema al cargar los datos del perfil.');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login'); // Redirige a la pantalla de login después de cerrar sesión
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al cerrar sesión.');
    }
  };

  const handleSave = async () => {
    try {
      const userId = auth.currentUser?.uid;
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        nombre: nombre,
        apellido: apellido,
      });
      Alert.alert('Éxito', 'Datos actualizados correctamente.');
      setEditing(false); // Salir del modo de edición
    } catch (error) {
      console.error('Error al actualizar los datos del perfil: ', error);
      Alert.alert('Error', 'Hubo un problema al actualizar los datos.');
    }
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* Botón Atrás */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Atrás</Text>
      </TouchableOpacity>

      {/* Imagen de perfil */}
      <Image
        source={require('../assets/icons/usuario.png')} // Reemplazar con la ruta de tu imagen de perfil
        style={styles.profileImage}
      />

      {/* Botón para editar los datos */}
      {editing ? (
        <>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre"
          />
          <TextInput
            style={styles.input}
            value={apellido}
            onChangeText={setApellido}
            placeholder="Apellido"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>Nombre: {userData.nombre}</Text>
          <Text style={styles.label}>Apellido: {userData.apellido}</Text>
          <Text style={styles.label}>Correo electrónico: {userData.email}</Text>
          <Text style={styles.label}>
            Fecha de creación: {userData.createdAt ? userData.createdAt.toDate().toLocaleDateString() : 'Desconocido'}
          </Text>
          <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
            <Text style={styles.editButtonText}>Editar perfil</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  backButton: {
    fontSize: 18,
    color: '#007AFF',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ProfileScreen;
