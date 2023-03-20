'use strict';

import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Header from '../src/components/header-component';
import ChatsScreen from '../src/screens/chats-screen';
import ContactsScreen from '../src/screens/contacts-screen';
import ProfileScreen from '../src/screens/profile-screen';

class TabNavigator extends Component {

  render() {

    const Tab = createMaterialTopTabNavigator();

    return (

    // Adding a React.Fragment so we can include the header above the tab navigator
    // React.Fragment allows us to group a list of children and return them
      <>
        {/* Passing down the navigation prop to our Header component (for the logout function) */}
        <Header navigation={this.props.navigation} />

        <Tab.Navigator
          initialRouteName="Chats"
          screenOptions={{
            tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
            tabBarStyle: { backgroundColor: '#2a363b' },
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'grey'
          }}
        >

          <Tab.Screen name="Chats" component={ChatsScreen} options={{ tabBarLabel: 'Chats' }} />
          <Tab.Screen name="Contacts" component={ContactsScreen} options={{ tabBarLabel: 'Contacts' }} />
          <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />

        </Tab.Navigator>

      </>

    );

  }

}

export default TabNavigator;