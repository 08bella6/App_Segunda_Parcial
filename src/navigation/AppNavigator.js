import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import PasswordsListScreen from '../screens/PasswordsListScreen';
import PasswordDetailScreen from '../screens/PasswordDetailScreen';
import AddPasswordScreen from '../screens/AddPasswordScreen'; 
import EditPasswordScreen from '../screens/EditPasswordScreen';
import DeletePasswordScreen from '../screens/DeletePasswordScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Importa las pantallas de contraseñas débiles y Wi-Fi
import WeakPasswordsListScreen from '../screens/WeakPasswordsListScreen';
import WeakPasswordDetailScreen from '../screens/WeakPasswordDetailScreen';
import EditWeakPasswordScreen from '../screens/EditWeakPasswordScreen';

import WifiListScreen from '../screens/WifiListScreen';
import WifiDetailScreen from '../screens/WifiDetailScreen';
import AddWifiScreen from '../screens/AddWifiScreen';

const Stack = createStackNavigator();

const AppNavigator = ({ user }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <React.Fragment>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="PasswordsList" component={PasswordsListScreen} />
          <Stack.Screen name="PasswordDetail" component={PasswordDetailScreen} />
          <Stack.Screen name="AddPassword" component={AddPasswordScreen} />
          <Stack.Screen name="EditPassword" component={EditPasswordScreen} />
          <Stack.Screen name="DeletePassword" component={DeletePasswordScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />

          {/* Nuevas pantallas para contraseñas débiles */}
          <Stack.Screen name="WeakPasswordsList" component={WeakPasswordsListScreen} />
          <Stack.Screen name="WeakPasswordDetail" component={WeakPasswordDetailScreen} />
          <Stack.Screen name="EditWeakPassword" component={EditWeakPasswordScreen} />

          {/* Pantallas de Wi-Fi */}
          <Stack.Screen name="WifiList" component={WifiListScreen} />
          <Stack.Screen name="WifiDetail" component={WifiDetailScreen} />
          <Stack.Screen name="AddWifi" component={AddWifiScreen} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </React.Fragment>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
