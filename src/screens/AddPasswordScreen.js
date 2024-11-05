import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { savePassword } from '../services/AuthService';
import { auth } from '../firebaseConfig';

const generateStrongPassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
};

// Función para verificar la fortaleza de la contraseña
const checkPasswordStrength = (password, username = '', accountName = '') => {
  let strength = 'weak';

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()]/.test(password);
  const minLength = password.length >= 8;

  // Verificar que la contraseña no contenga ni el username ni el accountName
  const noUsername = !password.toLowerCase().includes(username.toLowerCase());
  const noAccountName = !password.toLowerCase().includes(accountName.toLowerCase());

  if (minLength && hasLower && hasUpper && hasNumber && hasSpecial && noUsername && noAccountName) {
    strength = 'strong';
  } else if (minLength && ((hasLower && hasUpper) || (hasNumber && hasSpecial)) && noUsername && noAccountName) {
    strength = 'medium';
  }

  return strength;
};

const AddPasswordScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(generateStrongPassword());
  const [website, setWebsite] = useState('');
  const [strength, setStrength] = useState('strong'); // Contraseña generada inicialmente es fuerte
  const [isStrong, setIsStrong] = useState(true); // Valor inicial `true`

  useEffect(() => {
    // Cada vez que la contraseña se carga, se evalúa como fuerte por defecto
    setIsStrong(true);
  }, []);

  const handleSave = async () => {
    if (!username || !password || !website) {
      Alert.alert('Error', 'Por favor complete todos los campos.');
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const passwordData = {
        usuario: username,
        contraseña: password,
        sitio_web: website,
        createdAt: new Date(),
        fuerte: isStrong // Fuerte según la evaluación de `checkPasswordStrength`
      };

      await savePassword(userId, passwordData);
      Alert.alert('Éxito', 'La contraseña ha sido guardada exitosamente.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar la contraseña', error);
      Alert.alert('Error', 'Hubo un problema al guardar la contraseña.');
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    const newStrength = checkPasswordStrength(value, username, website);
    setStrength(newStrength);
    setIsStrong(newStrength === 'strong'); // Solo si es "strong" se mantiene como fuerte
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Contraseña</Text>
      <TextInput
        placeholder="Sitio Web o Etiqueta"
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
        style={[styles.input, styles.passwordInput]}
        value={password}
        onChangeText={handlePasswordChange}
      />

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

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar Contraseña</Text>
      </TouchableOpacity>
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
  passwordInput: {
    marginBottom: 10,
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
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 2,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddPasswordScreen;
