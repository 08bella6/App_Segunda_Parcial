import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const WeakPasswordsListScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [weakPasswords, setWeakPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const userId = auth.currentUser?.uid;

      if (userId) {
        const passwordsRef = collection(db, 'users', userId, 'passwords');

        const unsubscribe = onSnapshot(
          passwordsRef,
          (snapshot) => {
            const fetchedPasswords = snapshot.docs
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
              .filter((password) => password.fuerte === false);

            const sortedPasswords = fetchedPasswords.sort((a, b) =>
              a.sitio_web.localeCompare(b.sitio_web)
            );
            setWeakPasswords(sortedPasswords);
            setLoading(false);
          },
          (error) => {
            console.error('Error al obtener las contraseñas débiles: ', error);
            setError('Error al obtener las contraseñas débiles');
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } else {
        console.error('No hay usuario autenticado');
        setError('No hay usuario autenticado');
        setLoading(false);
      }
    }, [])
  );

  const filteredData = weakPasswords.filter(
    (item) =>
      item.sitio_web.toLowerCase().includes(searchText.toLowerCase()) ||
      item.usuario.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('WeakPasswordDetail', { passwordId: item.id })
      }
    >
      <View style={styles.itemContent}>
        <View>
          <Text style={styles.itemService}>{item.sitio_web}</Text>
          <Text style={styles.itemUsername}>{item.usuario}</Text>
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : filteredData.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No tienes contraseñas débiles.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
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
    flex: 1 
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
  chevron: { 
    fontSize: 24, 
    color: '#ccc' 
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
  noDataContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  noDataText: { 
    fontSize: 18, 
    color: '#666' 
  },
});

export default WeakPasswordsListScreen;
