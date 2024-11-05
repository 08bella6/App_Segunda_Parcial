import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { deleteWifiNetwork } from '../services/AuthService'; // Importación corregida

const WifiDetailScreen = () => {
  const [wifiDetail, setWifiDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const navigation = useNavigation();
  const { wifiId } = route.params;

  useEffect(() => {
    const fetchWifiDetail = async () => {
      try {
        const userId = auth.currentUser.uid;
        const wifiDocRef = doc(db, 'users', userId, 'wifi', wifiId);
        const wifiDoc = await getDoc(wifiDocRef);
        if (wifiDoc.exists()) {
          setWifiDetail(wifiDoc.data());
        } else {
          console.log('No se encontró el documento');
        }
      } catch (error) {
        console.error('Error al obtener los detalles de la red Wi-Fi', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWifiDetail();
  }, [wifiId]);

  const handleForget = async () => {
    try {
      const userId = auth.currentUser.uid;
      await deleteWifiNetwork(userId, wifiId); // Eliminar la red Wi-Fi
      Alert.alert('Éxito', 'La red Wi-Fi ha sido olvidada.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al olvidar la red Wi-Fi:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Cargando detalles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerButton}>Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Red Wi-Fi</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailText}><Text style={styles.label}>Nombre: </Text>{wifiDetail?.nombre || 'Desconocido'}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Contraseña: </Text>{wifiDetail?.contraseña || 'Desconocido'}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Conectado desde: </Text>{wifiDetail?.connectedAt ? wifiDetail.connectedAt.toDate().toLocaleDateString() : 'Desconocido'}</Text>
      </View>

      <TouchableOpacity style={styles.forgetButton} onPress={handleForget}>
        <Text style={styles.forgetButtonText}>Olvidar Red Wi-Fi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  forgetButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  forgetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WifiDetailScreen;
