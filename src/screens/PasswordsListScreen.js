import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { collection, onSnapshot } from 'firebase/firestore'; // Importamos onSnapshot para tiempo real
import { auth, db } from '../firebaseConfig'; // Importamos auth y db para Firebase

const PasswordsListScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener contraseñas en tiempo real
  useFocusEffect(
    React.useCallback(() => {
      const userId = auth.currentUser?.uid;

      if (userId) {
        const passwordsRef = collection(db, 'users', userId, 'passwords');

        const unsubscribe = onSnapshot(
          passwordsRef,
          (snapshot) => {
            const fetchedPasswords = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            // Ordenar las contraseñas por 'sitio_web'
            const sortedPasswords = fetchedPasswords.sort((a, b) =>
              a.sitio_web.localeCompare(b.sitio_web)
            );
            setPasswords(sortedPasswords);
            setLoading(false);
          },
          (error) => {
            console.error('Error al obtener las contraseñas: ', error);
            setError('Error al obtener las contraseñas');
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

  // Filtrar las contraseñas según el texto de búsqueda
  const filteredData = passwords.filter(
    (item) =>
      item.sitio_web.toLowerCase().includes(searchText.toLowerCase()) ||
      item.usuario.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('PasswordDetail', { passwordId: item.id })
      }
    >
      <View style={styles.itemContent}>
        <Image source={{ uri: item.icono }} style={styles.itemIcon} />
        <View>
          <Text style={styles.itemService}>{item.sitio_web}</Text>
          <Text style={styles.itemUsername}>{item.usuario}</Text>
        </View>
      </View>
  
      {/* Mostrar el ícono de advertencia si la contraseña es débil */}
      {item.fuerte === false && (
        <Image
          source={require('../assets/icons/attention.png')}
          style={styles.warningIcon}
        />
      )}
  
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
        onPress={() => navigation.navigate('AddPassword')}
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
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1 // Ocupa el espacio necesario
  },
  itemIcon: { 
    width: 40, 
    height: 40, 
    marginRight: 15 
  },
  itemService: { 
    fontSize: 18, 
    fontWeight: '500', 
    color: '#333' 
  },
  itemUsername: { 
    color: '#666', 
    marginTop: 2 
  },
  warningIcon: { 
    width: 20, 
    height: 20, 
    marginRight: 10,
    tintColor: 'red', // Esto agrega un color rojo para que coincida con el fondo de advertencia
    position: 'relative', // Para facilitar posicionamiento
    alignSelf: 'center' // Centrado con el texto
  },
  chevron: { 
    fontSize: 24, 
    color: '#ccc' 
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
    lineHeight: 30 
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

export default PasswordsListScreen;
