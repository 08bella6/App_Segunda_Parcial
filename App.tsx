import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { onAuthStateChanged } from './src/services/AuthService';
import { ActivityIndicator, View } from 'react-native';
import { User } from 'firebase/auth'; // Importa el tipo User de Firebase

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // Define el tipo para el estado del usuario
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user: User | null) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator user={user} />
    </NavigationContainer>
  );
};

export default App;