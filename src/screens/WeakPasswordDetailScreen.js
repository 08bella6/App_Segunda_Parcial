import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const WeakPasswordDetailScreen = () => {
  const [passwordDetail, setPasswordDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const navigation = useNavigation();
  const { passwordId } = route.params || {};

  useEffect(() => {
    const fetchPasswordDetail = async () => {
      try {
        if (!auth.currentUser) {
          console.error('No se ha encontrado un usuario autenticado.');
          setLoading(false);
          return;
        }

        if (!passwordId) {
          console.warn('No se ha proporcionado un passwordId.');
          setLoading(false);
          return;
        }

        const userId = auth.currentUser.uid;
        const passwordRef = doc(db, 'users', userId, 'passwords', passwordId);
        const passwordDoc = await getDoc(passwordRef);

        if (passwordDoc.exists()) {
          setPasswordDetail(passwordDoc.data());
        } else {
          console.log('El documento de la contraseña no existe.');
          setPasswordDetail(null);
        }
      } catch (error) {
        console.error('Error al obtener el detalle de la contraseña: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPasswordDetail();
  }, [passwordId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!passwordDetail) {
    return (
      <View style={styles.container}>
        <Text>No se encontró la contraseña.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerButton}>Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Contraseña Débil</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditWeakPassword', { passwordId })}>
          <Text style={styles.headerButton}>Editar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailText}><Text style={styles.label}>Servicio: </Text>{passwordDetail.sitio_web || 'Desconocido'}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Usuario: </Text>{passwordDetail.usuario || 'Desconocido'}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Contraseña: </Text>{passwordDetail.contraseña || 'Desconocido'}</Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Última modificación: </Text>
          {passwordDetail.lastModified 
            ? passwordDetail.lastModified.toDate().toLocaleString() 
            : (passwordDetail.createdAt ? passwordDetail.createdAt.toDate().toLocaleString() : 'Desconocido')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5',
    padding: 20 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  headerButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  detailContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },
});

export default WeakPasswordDetailScreen;
