import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { collection, onSnapshot } from 'firebase/firestore'; // Importamos onSnapshot para tiempo real
import { auth, db } from '../firebaseConfig'; // Importamos auth y db para Firebase

const WifiListScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [wifiList, setWifiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener redes Wi-Fi en tiempo real
  useFocusEffect(
    React.useCallback(() => {
      const userId = auth.currentUser?.uid;

      if (userId) {
        const wifiRef = collection(db, 'users', userId, 'wifi');

        const unsubscribe = onSnapshot(
          wifiRef,
          (snapshot) => {
            const fetchedWifiList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            // Ordenar las redes Wi-Fi por 'nombre'
            const sortedWifi = fetchedWifiList.sort((a, b) =>
              a.nombre.localeCompare(b.nombre)
            );
            setWifiList(sortedWifi);
            setLoading(false);
          },
          (error) => {
            console.error('Error al obtener las redes Wi-Fi:', error);
            setError('Error al obtener las redes Wi-Fi');
            setLoading(false);
          }
        );

        // Desvinculamos el listener cuando el componente pierde el enfoque o se desmonta
        return () => unsubscribe();
      } else {
        console.error('No hay usuario autenticado');
        setError('No hay usuario autenticado');
        setLoading(false);
      }
    }, [])
  );

  // Filtrar las redes Wi-Fi según el texto de búsqueda
  const filteredData = wifiList.filter(
    (item) =>
      item.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('WifiDetail', { wifiId: item.id })
      }
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemService}>{item.nombre}</Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Conectado desde: </Text>
          {item?.connectedAt ? item.connectedAt.toDate().toLocaleDateString() : 'Desconocido'}
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Contenedor para el botón "Atrás" y el campo de búsqueda */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Atrás</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Buscar"
          style={styles.searchBar}
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddWifi')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemContent: { 
    flexDirection: 'column', // Cambiado para mostrar la información en columnas
    alignItems: 'flex-start',
  },
  itemService: { 
    fontSize: 18, 
    fontWeight: '500', 
    color: '#333',
    marginBottom: 5,  // Espacio entre el nombre y la fecha
  },
  label: {
    fontWeight: 'bold',
    color: '#666',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  chevron: { 
    fontSize: 24, 
    color: '#ccc',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  addButtonText: { 
    color: '#fff', 
    fontSize: 30, 
    lineHeight: 30,
  },
  errorContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  errorText: { 
    color: 'red', 
    fontSize: 18 
  },
});

export default WifiListScreen;
