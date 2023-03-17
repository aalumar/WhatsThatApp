/* eslint-disable camelcase */
// Disabling due to message_id which is a naming scheme from the API

'use strict';

import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GiftedChat } from 'react-native-gifted-chat';

class IndividualChat extends Component {

  constructor(props) {

    super(props);

    this.state = {

      isLoading: true,
      // messages: [],
      chatDetails: []

    };

    this.onSend = this.onSend.bind(this);

  }

  async componentDidMount() {

    // check user is logged in
    this.unsubscribe = this.props.navigation.addListener('focus', () => {

      this.checkLoggedIn();

    });

    // Updating header title of stack navigator to the chat's name
    this.props.navigation.setOptions({ title: this.props.route.params.chatName });

    await this.getMessages();
    this.formatMessage();

  }

  componentWillUnmount() {

    // close listener to avoid memory leakage
    this.unsubscribe();

  }

  onSend(messages = []) {

    this.setState((previousState) => {

      return {

        chatDetails: GiftedChat.append(previousState.chatDetails, messages)

      };

    });

  }

  // function to check if the user is logged in, otherwise send them back to the login page
  checkLoggedIn = async () => {

    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null) {

      this.props.navigation.navigate('Login');

    }

  };

  getMessages = async () => {

    const chatID = this.props.route.params.chatID;

    return fetch('http://localhost:3333/api/1.0.0/chat/' + chatID, {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      }
    })
      .then((response) => { return response.json(); })
      .then((responseJson) => {

        this.setState({
          chatDetails: responseJson.messages
        });

        console.log(this.state.chatDetails);

      })
    // Add error message here
      .catch((error) => {

        console.log(error);

      });

  };

  formatMessage() {

    this.state.chatDetails = this.state.chatDetails.map(({ message_id, timestamp, message, author }) => {

      return {
        _id: message_id,
        createdAt: timestamp,
        text: message,
        user: author
      };

    });

    this.setState({
      isLoading: false
    });

    console.log(this.state.chatDetails);

  }

  render() {

    if (this.state.isLoading) {

      return (
        <View style={{ justifyContent: 'center', alignContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );

    }

    return (

      <View style={{ flex: 1 }}>

        <GiftedChat
          messages={this.state.chatDetails}
          onSend={(messages) => { return this.onSend(messages); }}
        />

      </View>

    );

  }

}

export default IndividualChat;