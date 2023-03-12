'use strict';

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../components/login-screen';
import RegisterScreen from '../components/register-screen';
import TabNavigator from './tab-navigator';

class StackNavigator extends Component {

    render () {

        const Stack = createNativeStackNavigator();
    
        return (

            <NavigationContainer>
    
                <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>

                <Stack.Screen name='Login' component={LoginScreen} />
                <Stack.Screen name='Register' component={RegisterScreen} />
                <Stack.Screen name='Chats' component={TabNavigator} />
                
                </Stack.Navigator>
    
            </NavigationContainer>
          
        );
      }
}

export default StackNavigator