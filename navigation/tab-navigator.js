'use strict';

import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Header from '../components/header-component';
import ChatsScreen from '../components/chats-screen';
import ContactsScreen from '../components/contacts-screen';
import ProfileScreen from '../components/profile-screen';

class TabNavigator extends Component {

    render () {

        const Tab = createMaterialTopTabNavigator();
    
        return (

            // Adding a React.Fragment so we can include the header above the tab navigator
            // React.Fragment allows us to group a list of children and return them
            <>
                <Header />

                <Tab.Navigator initialRouteName='Chats' screenOptions={{
                    tabBarLabelStyle: {fontSize: 14, fontWeight: 'bold'},
                    tabBarStyle: {backgroundColor: '#2a363b'},
                    tabBarActiveTintColor: 'white',
                    tabBarInactiveTintColor: 'grey'
                }}
                >
                    
                    <Tab.Screen name='Chats' component={ChatsScreen} options={{tabBarLabel: 'Chats'}}/>
                    <Tab.Screen name="Contacts" component={ContactsScreen} options={{tabBarLabel: 'Contacts'}}/>
                    <Tab.Screen name="Profile" component={ProfileScreen} options={{tabBarLabel: 'Profile'}}/>

                </Tab.Navigator>

            </>
          
        );
      }
}

export default TabNavigator