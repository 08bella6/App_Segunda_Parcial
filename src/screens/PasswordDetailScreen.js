import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

// Función para verificar la fortaleza de la contraseña (igual que en AddPasswordScreen)
const checkPasswordStrength = (password, username, accountName) => {
  let strength = 'weak';

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()]/.test(password);
  const minLength = password.length >= 8;

  const noUsername = !password.toLowerCase().includes(username.toLowerCase());
  const noAccountName = !password.toLowerCase().includes(accountName.toLowerCase());

  if (minLength && hasLower && hasUpper && hasNumber && hasSpecial && noUsername && noAccountName) {
    strength = 'strong';
  } else if (minLength && ((hasLower && hasUpper) || (hasNumber && hasSpecial)) && noUsername && noAccountName) {
    strength = 'medium';
  }

  return strength;
};

const PasswordDetailScreen = () => {
  const [passwordDetail, setPasswordDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [strength, setStrength] = useState('weak');
  
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
          const data = passwordDoc.data();
          setPasswordDetail(data);
          setStrength(checkPasswordStrength(data.contraseña, data.usuario, data.sitio_web));
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
        <Text style={styles.headerTitle}>Detalle de Contraseña</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditPassword', { passwordId })}>
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

        {/* Indicador visual de fortaleza */}
        <View style={styles.indicatorContainer}>
          <View style={[styles.indicator, strength === 'weak' && styles.weak]} />
          <View style={[styles.indicator, strength === 'medium' && styles.medium]} />
          <View style={[styles.indicator, strength === 'strong' && styles.strong]} />
        </View>

        {/* Texto de fortaleza */}
        <Text style={[styles.strengthText, styles[strength]]}>
          {strength === 'weak' && 'Contraseña Débil'}
          {strength === 'medium' && 'Contraseña Media'}
          {strength === 'strong' && 'Contraseña Fuerte'}
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
  indicatorContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  indicator: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginHorizontal: 2,
  },
  weak: { backgroundColor: '#ff4757' },
  medium: { backgroundColor: 'orange' },
  strong: { backgroundColor: '#23ad5c' },
  strengthText: {
    textAlign: 'center',
    marginVertical: 5,
    fontSize: 14,
  },
  weakText: { color: '#ff4757' },
  mediumText: { color: 'orange' },
  strongText: { color: '#23ad5c' },
});

export default PasswordDetailScreen;
