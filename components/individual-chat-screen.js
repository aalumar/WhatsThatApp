'use strict';

import React, { Component } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GiftedChat } from 'react-native-gifted-chat';
import globalStyles from '../styles/global';

class IndividualChat extends Component {

  constructor(props) {
    super(props);

    this.state = {
      
      isLoading: true,
      messages: [],
      chatDetails: []

    };

    this.onSend = this.onSend.bind(this);

  }
  

  componentDidMount() {
    // check user is logged in
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn()
    })

    //Updating header title of stack navigator to the chat's name
    this.props.navigation.setOptions({ title: this.props.route.params.chatName})

    this.getMessages()
    this.formatMessage()

  }

  componentWillUnmount() {
    // close listener to avoid memory leakage
    this.unsubscribe()
  }

  // function to check if the user is logged in, otherwise send them back to the login page
  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('whatsthat_session_token')
    if (value == null) {
      this.props.navigation.navigate('Login')
    }
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  getMessages = async () => {

    const chatID = this.props.route.params.chatID

    return fetch("http://localhost:3333/api/1.0.0/chat/" + chatID, {
      headers: {
        "X-Authorization": await AsyncStorage.getItem('whatsthat_session_token')
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {

      this.setState({
        isLoading: false,
        chatDetails: responseJson.messages
      })

      console.log(this.state.chatDetails)

    })
    // Add error message here
    .catch((error) => {
      console.log(error)
    })

  }

  formatMessage() {

    console.log(this.state.chatDetails)
    this.state.chatDetails = this.state.chatDetails.map(({message_id, timestamp, message, author}) => {
      return {
        _id: message_id,
        createdAt: timestamp,
        text: message,
        user: author
      }
    });


  }

  render () {
    
        return (

          <View style={{flex: 1}}>

            <GiftedChat
              messages={this.state.messages}
              onSend={messages => this.onSend(messages)}
              user={{
                _id: 1,
              }}
            />
          </View>

        )
    }
}

const styles = StyleSheet.create({
})

export default IndividualChat