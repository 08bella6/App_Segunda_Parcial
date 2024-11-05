import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { collection, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const DeletePasswordScreen = () => {
  const [deletedPasswords, setDeletedPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Cargar las contraseñas eliminadas al montar el componente
  useEffect(() => {
    const fetchDeletedPasswords = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          throw new Error('Usuario no autenticado.');
        }

        const deletedPasswordsRef = collection(db, 'users', userId, 'eliminadas');
        const querySnapshot = await getDocs(deletedPasswordsRef);
        const passwordsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDeletedPasswords(passwordsList);
      } catch (error) {
        console.error('Error al cargar las contraseñas eliminadas: ', error);
        Alert.alert('Error', 'No se pudieron cargar las contraseñas eliminadas.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedPasswords();
  }, []);

  // Función para restaurar una contraseña eliminada
  const handleRestore = async (passwordId, originalData) => {
    try {
      const userId = auth.currentUser.uid;
      const originalPasswordRef = doc(db, 'users', userId, 'passwords', passwordId);
      await setDoc(originalPasswordRef, originalData); // Restaurar a la colección original
      await handlePermanentDelete(passwordId); // Eliminar de la colección "eliminadas"
      Alert.alert('Éxito', 'La contraseña ha sido restaurada.');
    } catch (error) {
      console.error('Error al restaurar la contraseña: ', error);
      Alert.alert('Error', 'Hubo un problema al restaurar la contraseña.');
    }
  };

  // Función para eliminar permanentemente una contraseña
  const handlePermanentDelete = async (passwordId) => {
    try {
      const userId = auth.currentUser.uid;
      const passwordRef = doc(db, 'users', userId, 'eliminadas', passwordId);
      await deleteDoc(passwordRef);
      setDeletedPasswords((prev) =>
        prev.filter((password) => password.id !== passwordId)
      );
      Alert.alert('Eliminado', 'La contraseña ha sido eliminada permanentemente.');
    } catch (error) {
      console.error('Error al eliminar permanentemente la contraseña: ', error);
      Alert.alert('Error', 'Hubo un problema al eliminar la contraseña.');
    }
  };

  // Renderizar cada elemento de la lista de contraseñas eliminadas
  const renderPassword = ({ item }) => (
    <View style={styles.passwordContainer}>
      <Text style={styles.passwordText}>
        <Text style={styles.label}>Sitio Web: </Text> {item.sitio_web}
      </Text>
      <Text style={styles.passwordText}>
        <Text style={styles.label}>Usuario: </Text> {item.usuario}
      </Text>

      {/* Botón para restaurar la contraseña */}
      <TouchableOpacity
        style={styles.restoreButton}
        onPress={() => handleRestore(item.id, item)}
      >
        <Text style={styles.restoreButtonText}>Restaurar</Text>
      </TouchableOpacity>

      {/* Botón para eliminar permanentemente la contraseña */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() =>
          Alert.alert(
            'Eliminar permanentemente',
            '¿Estás seguro de que deseas eliminar esta contraseña permanentemente?',
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Eliminar',
                style: 'destructive',
                onPress: () => handlePermanentDelete(item.id),
              },
            ]
          )
        }
      >
        <Text style={styles.deleteButtonText}>Eliminar Permanentemente</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>Atrás</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Contraseñas Eliminadas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : deletedPasswords.length === 0 ? (
        <Text style={styles.noPasswordsText}>No hay contraseñas eliminadas.</Text>
      ) : (
        <FlatList
          data={deletedPasswords}
          keyExtractor={(item) => item.id}
          renderItem={renderPassword}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  passwordContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  passwordText: {
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  restoreButton: {
    backgroundColor: '#64C466',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  restoreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 20,
  },
  noPasswordsText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default DeletePasswordScreen;
