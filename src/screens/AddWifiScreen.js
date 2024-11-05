import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { saveWifiNetwork } from '../services/AuthService'; // Function to save Wi-Fi network
import { auth } from '../firebaseConfig'; // Import auth to get the userId

const AddWifiScreen = () => {
  const navigation = useNavigation();
  const [networkName, setNetworkName] = useState(''); // Wi-Fi network name
  const [password, setPassword] = useState(''); // Password

  // Function to handle saving the Wi-Fi network
  const handleSave = async () => {
    if (!networkName || !password) {
      Alert.alert('Error', 'Please complete all fields.');
      return;
    }

    try {
      const userId = auth.currentUser?.uid; // Ensure userId exists
      if (!userId) {
        throw new Error('User not authenticated.');
      }

      const wifiData = {
        nombre: networkName,
        contraseña: password,
        connectedAt: new Date(), // Automatic connection date
      };

      await saveWifiNetwork(userId, wifiData);
      Alert.alert('Success', 'Wi-Fi network saved successfully.');
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      console.error('Error saving Wi-Fi network:', error);
      Alert.alert('Error', 'There was a problem saving the Wi-Fi network.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Wi-Fi Network</Text>
      <TextInput
        placeholder="Network Name"
        style={styles.input}
        value={networkName}
        onChangeText={setNetworkName}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Hide the password while typing
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Wi-Fi Network</Text>
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

export default AddWifiScreen;
