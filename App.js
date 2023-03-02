'use strict';

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/login-component';
import RegisterScreen from './components/register-component';
import HomeScreen from './components/home-screen-component';

class App extends Component {

  render () {

    const Stack = createNativeStackNavigator();

    return (
      
      <NavigationContainer>

        <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>

          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          
        </Stack.Navigator>

      </NavigationContainer>
      
    );
  }
}

export default App;