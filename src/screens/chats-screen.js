'use strict';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList, TouchableWithoutFeedback, Modal, Text, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import PreviewChat from '../components/preview-chat-component';
import globalStyles from '../../styles/global';

class ChatsScreen extends Component {

  constructor(props) {

    super(props);

    this.state = {

      isLoading: true,
      chatList: [],
      newChatModalVisible: false,
      chatName: ''

    };

  }

  componentDidMount() {

    // check user is logged in
    this.unsubscribe = this.props.navigation.addListener('focus', () => {

      this.checkLoggedIn();
      this.getChats();

    });

  }

  // componentDidUpdate() {

  //   this.getChats();

  // }

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

  setNewChatModalVisibleState = (visible) => {

    this.setState({
      newChatModalVisible: visible
    });

    if (visible === false) {

      this.setState({
        chatName: ''
      });

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

  createChat = async () => {

    const chatName = {
      name: this.state.chatName
    };

    return fetch('http://localhost:3333/api/1.0.0/chat', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(chatName)
    })
      .then((response) => {

        this.getChats();

        const status = response.status;
        if (status === 201) {

          throw 'Chat created successfully!';

        }
        else if (status === 500) {

          throw 'Please try again in a bit.';

        }

      })
    // Add error message here
      .catch((error) => {

        console.log(error);

      });

  };

  renderNewChatModal() {

    return (
      <TouchableWithoutFeedback onPress={() => { return this.setNewChatModalVisibleState(!this.state.newChatModalVisible); }}>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.newChatModalVisible}
          onRequestClose={() => {

            this.setNewChatModalVisibleState(!this.state.newChatModalVisible);

          }}
        >
          <View style={{ flex: 1, backgroundColor: '#000000AA', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback>

              <View style={{
                backgroundColor: '#2a363b',
                width: '75%',
                height: '25%',
                borderRadius: 10,
                padding: '5%',
                alignItems: 'center'
              }}
              >

                <View style={{ justifyContent: 'center', alignItems: 'center', fontSize: 20 }}>
                  <Text style={[globalStyles.bold, { color: '#ffffff' }]}>
                    Enter your chat's name
                  </Text>
                </View>

                <View style={{ marginTop: '10%', marginBottom: '10%' }}>
                  <TextInput
                    style={[globalStyles.textInput, { width: '100%', borderColor: '#ffffff', fontStyle: 'normal', color: '#ffffff' }]}
                    placeholder="Enter name"
                    onChangeText={(chatName) => { return this.setState({ chatName }); }}
                    value={this.state.chatName}
                  />
                </View>

                <TouchableOpacity
                  style={[globalStyles.pressableRegisterGoBackButton, { width: '70%', backgroundColor: '#4e5559' }]}
                  onPress={() => { this.setNewChatModalVisibleState(!this.state.newChatModalVisible); this.createChat(); }}
                >

                  <Text style={globalStyles.registerGoBackText}>
                    CREATE
                  </Text>

                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </TouchableWithoutFeedback>

    );

  }

  render() {

    if (this.state.isLoading) {

      return (
        <View style={[styles.flatListParentView, { justifyContent: 'center', alignContent: 'center' }]}>
          <ActivityIndicator />
        </View>
      );

    }

    return (

      <View style={styles.flatListParentView}>

        <FlatList
          data={this.state.chatList}
          style={{ height: '80%' }}
          renderItem={({ item }) => {

            // passing the chat's ID and name to the IndividualChat screen (so we can get the messages)
            return (
              <TouchableOpacity onPress={() => {

                return this.props.navigation.navigate('IndividualChat', { chatID: item.chat_id,
                  chatName: item.name });

              }}
              >

                <PreviewChat id={item.chat_id} name={item.name} lastMessage={item.last_message.message} navigation={this.props.navigation} />

              </TouchableOpacity>
            );

          }}
          keyExtractor={({ id }) => { return id; }}

        />

        <TouchableOpacity style={styles.chatIcon} onPress={() => { this.setNewChatModalVisibleState(true); }}>
          <MaterialIcons name="chat" size={24} color="#000000" />
        </TouchableOpacity>

        {this.renderNewChatModal()}

      </View>

    );

  }

}

const styles = StyleSheet.create({

  flatListParentView: {
    flex: 1,
    backgroundColor: '#99b898'
  },
  chatIcon: {
    position: 'absolute',
    width: '20%',
    height: '10%',
    bottom: '3%',
    right: '5%',
    borderRadius: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#707070'
  }

});

export default ChatsScreen;