'use strict';

import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ChatsScreen from '../components/chats-screen-component';
import ContactsScreen from '../components/contacts-screen-component';
import ProfileScreen from '../components/profile-screen-component';

class TabNavigator extends Component {

    render () {

        const Tab = createMaterialTopTabNavigator();
    
        return (

            <Tab.Navigator initialRouteName='Chats' screenOptions={{
                tabBarLabelStyle: {fontSize: 14},
                tabBarStyle: {backgroundColor: '#2a363b'},
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'grey'
              }}
            >
                
                <Tab.Screen name='Chats' component={ChatsScreen} options={{tabBarLabel: 'Chats'}}/>
                <Tab.Screen name="Contacts" component={ContactsScreen} options={{tabBarLabel: 'Contacts'}}/>
                <Tab.Screen name="Profile" component={ProfileScreen} options={{tabBarLabel: 'Profile'}}/>

            </Tab.Navigator>
          
        );
      }
}

export default TabNavigator