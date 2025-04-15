import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import UploadPostScreen from '../screens/UploadPostScreen';
import EditPostScreen from '../screens/EditPostScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="UploadPost" component={UploadPostScreen} />
        <Stack.Screen name="EditPost" component={EditPostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;