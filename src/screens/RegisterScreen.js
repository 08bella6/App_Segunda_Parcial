import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { registerUser } from '../services/AuthService';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');  // Estado para almacenar el nombre
  const [apellido, setApellido] = useState(''); // Estado para almacenar el apellido
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(''); // Estado de error

  const handleRegister = () => {
    if (name && apellido && email && password) {
      setLoading(true); // Mostrar indicador de carga
      registerUser(email, password, name, apellido)
        .then(() => {
          setLoading(false);
          alert('Registro exitoso. Ahora puede iniciar sesión.');
          navigation.navigate('Login');
        })
        .catch((error) => {
          setLoading(false);
          setError('Error al registrarse: ' + error.message); // Mostrar mensaje de error
        });
    } else {
      setError('Por favor, complete todos los campos.'); // Mostrar mensaje de error si faltan campos
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Text style={styles.title}>Crear Cuenta</Text>
      
      {/* Mostrar error si existe */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        placeholder="Nombre"
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Apellido"
        style={styles.input}
        value={apellido}
        onChangeText={setApellido}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />

      {/* Mostrar indicador de carga si está en proceso de registro */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>¿Ya tienes una cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40, textAlign: 'center', color: '#333' },
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
    backgroundColor: '#28A745',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  link: { color: '#007AFF', fontSize: 16, textAlign: 'center', marginTop: 20 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 20 },
});

export default RegisterScreen;
