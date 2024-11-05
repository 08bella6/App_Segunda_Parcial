import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { resetPassword } from '../services/AuthService';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    if (email) {
      try {
        await resetPassword(email);
        alert('Revisa tu correo electrónico para restablecer tu contraseña.');
        navigation.navigate('Login');
      } catch (error) {
        alert('Error al enviar el correo: ' + error.message);
      }
    } else {
      alert('Por favor, ingrese su correo electrónico.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 40, textAlign: 'center', color: '#333' },
  input: {
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#FFC107',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  link: { color: '#007AFF', fontSize: 16, textAlign: 'center', marginTop: 20 },
});

export default ForgotPasswordScreen;
