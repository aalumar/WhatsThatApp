'use strict';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import PreviewChat from '../components/preview-chat-component';

class ChatsScreen extends Component {

  constructor(props) {

    super(props);

    this.state = {

      isLoading: true,
      chatList: []

    };

  }

  componentDidMount() {

    // check user is logged in
    this.unsubscribe = this.props.navigation.addListener('focus', () => {

      this.checkLoggedIn();

    });

    this.getChats();

  }

  componentWillUnmount() {

    // close listener to avoid memory leakage
    this.unsubscribe();

  }

  // function to check if the user is logged in, otherwise send them back to the login page
  checkLoggedIn = async () => {

    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null) {

      this.props.navigation.navigate('Login');

    }

  };

  getChats = async () => {

    return fetch('http://localhost:3333/api/1.0.0/chat', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      }
    })
      .then((response) => { return response.json(); })
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          chatList: responseJson
        });

      })
    // Add error message here
      .catch((error) => {

        console.log(error);

      });

  };

  render() {

    if (this.state.isLoading) {

      return (
        <View style={{ justifyContent: 'center', alignContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );

    }

    return (

      <View style={styles.flatListParentView}>

        <FlatList
          data={this.state.chatList}
          renderItem={({ item }) => {

            // passing the chat's ID and name to the IndividualChat screen (so we can get the messages)
            return (
              <TouchableOpacity onPress={() => {

                return this.props.navigation.navigate('IndividualChat', { chatID: item.chat_id,
                  chatName: item.name });

              }}
              >

                <PreviewChat name={item.name} lastMessage={item.last_message.message} />

              </TouchableOpacity>
            );

          }}
          keyExtractor={({ id }) => { return id; }}

        />

      </View>

    );

  }

}

const styles = StyleSheet.create({

  flatListParentView: {
    flex: 1,
    backgroundColor: '#99b898'
  }

});

export default ChatsScreen;