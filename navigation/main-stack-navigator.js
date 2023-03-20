'use strict';

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../src/screens/login-screen';
import RegisterScreen from '../src/screens/register-screen';
import ChatStackNavigator from './chat-stack-navigator';

class StackNavigator extends Component {

  render() {

    const Stack = createNativeStackNavigator();

    return (

      <NavigationContainer>

        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>

          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Chats" component={ChatStackNavigator} />

        </Stack.Navigator>

      </NavigationContainer>

    );

  }

}

export default StackNavigator;