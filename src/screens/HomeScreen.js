import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// Importación de imágenes fuera del componente
import allIcon from '../assets/icons/all.png';
import weakPasswordIcon from '../assets/icons/adver.png';
import deletedIcon from '../assets/icons/deleted.png';
import profileIcon from '../assets/icons/usuario.png';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userId = auth.currentUser.uid;
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.nombre);
        } else {
          Alert.alert('Error', 'No se encontró el usuario.');
        }
      } catch (error) {
        console.error('Error al obtener el nombre del usuario:', error);
        Alert.alert('Error', 'Hubo un problema al cargar la información del usuario.');
      }
    };

    fetchUsername();
  }, []);

  // Categorías del menú
  const categories = [
    { name: 'Password', color: '#ff8d06', icon: allIcon },
    { name: 'Seguridad', color: '#b745f7', icon: weakPasswordIcon },
    { name: 'Eliminados', color: '#ff5640', icon: deletedIcon },
  ];

  const handleCategoryPress = (category) => {
    if (category === 'Eliminados') {
      navigation.navigate('DeletePassword');
    } else if (category === 'Seguridad') {
      navigation.navigate('WeakPasswordsList');
    } else {
      navigation.navigate('PasswordsList', { category });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Icono de perfil en la parte superior derecha */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={profileIcon} style={styles.profileIcon} />
        </TouchableOpacity>
      </View>

      {/* Título con el nombre del usuario */}
      <Text style={styles.welcomeText}>Bienvenido, {username}!</Text>

      <View style={styles.categoriesContainer}>
        <View style={styles.topRow}>
          {categories.slice(0, 2).map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryButton, { backgroundColor: category.color }]}
              onPress={() => handleCategoryPress(category.name)}
            >
              <Image source={category.icon} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.categoryButtonLarge, { backgroundColor: categories[2].color }]}
          onPress={() => handleCategoryPress(categories[2].name)}
        >
          <Image source={categories[2].icon} style={styles.categoryIcon} />
          <Text style={styles.categoryText}>{categories[2].name}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 20,
    color: '#333',
  },
  categoriesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  categoryButton: {
    width: '45%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  categoryButtonLarge: {
    width: '95%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default HomeScreen;