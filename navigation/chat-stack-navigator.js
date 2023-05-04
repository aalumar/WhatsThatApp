'use strict';

import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './tab-navigator';
import IndividualChat from '../src/screens/individual-chat-screen';
import BlockedUsersScreen from '../src/screens/blocked-users-screen';
import DraftedMessagesScreen from '../src/screens/drafted-messages-screen';
import AddContactScreen from '../src/screens/add-contact-screen';
import CameraScreen from '../src/screens/camera-screen';

class ChatStackNavigator extends Component {

  render() {

    const Stack = createNativeStackNavigator();

    return (

      <Stack.Navigator
        initialRouteName="Chats"
        screenOptions={{
          headerStyle: { backgroundColor: '#2a363b' },
          headerTintColor: '#ffffff'
        }}
      >

        <Stack.Screen
          name="Chats"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="IndividualChat"
          component={IndividualChat}
        />
        <Stack.Screen
          name="BlockedUsers"
          component={BlockedUsersScreen}
        />
        <Stack.Screen
          name="DraftedMessages"
          component={DraftedMessagesScreen}
        />
        <Stack.Screen
          name="AddContact"
          component={AddContactScreen}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
        />

      </Stack.Navigator>

    );

  }

}

export default ChatStackNavigator;