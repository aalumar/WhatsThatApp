'use strict';

import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './tab-navigator';
import IndividualChat from '../components/individual-chat-screen';

class ChatStackNavigator extends Component {

  render() {

    const Stack = createNativeStackNavigator();

    return (

      <Stack.Navigator initialRouteName="Chats">

        <Stack.Screen name="Chats" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="IndividualChat" component={IndividualChat} />

      </Stack.Navigator>

    );

  }

}

export default ChatStackNavigator;