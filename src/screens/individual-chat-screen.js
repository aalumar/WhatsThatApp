/* eslint-disable camelcase */
// Disabling due to message_id which is a naming scheme from the API

'use strict';

import React, { Component } from 'react';
import { View, ActivityIndicator, TouchableWithoutFeedback, TouchableOpacity, Modal, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GiftedChat } from 'react-native-gifted-chat';

class IndividualChat extends Component {

  constructor(props) {

    super(props);

    this.state = {

      isLoading: true,
      chatDetails: [],
      userID: null,
      messageLongPressModalVisible: false

    };

    this.onSend = this.onSend.bind(this);

  }

  async componentDidMount() {

    // check user is logged in
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {

      this.checkLoggedIn();

    });

    // Updating header title of stack navigator to the chat's name
    this.props.navigation.setOptions({ title: this.props.route.params.chatName });

    if (this.state.userID === null) {

      await this.getUserID();

    }

    await this.getMessages();

  }

  componentWillUnmount() {

    // close listener to avoid memory leakage
    this.unsubscribe();

  }

  setMessageLongPressModalVisible = (visible) => {

    this.setState({
      messageLongPressModalVisible: visible
    });

  };

  // function to check if the user is logged in, otherwise send them back to the login page
  checkLoggedIn = async () => {

    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null) {

      this.props.navigation.navigate('Login');

    }

  };

  onSend = async (messages = []) => {

    // eslint-disable-next-line arrow-body-style
    this.setState((previousState) => ({

      chatDetails: GiftedChat.append(previousState.chatDetails, messages)

    }));

  };

  sendMessage = async (messages = []) => {

    console.log(messages);
    const chatID = this.props.route.params.chatID;
    const message = {
      message: messages[0].text
    };

    return fetch('http://localhost:3333/api/1.0.0/chat/' + chatID + '/message', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify(message)
    })
      .then((response) => {

        const status = response.status;
        if (status === 200) {

          this.onSend();
          this.componentDidMount();
          throw 'Message sent successfully.';

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

  deleteMessage = async (message) => {

    const chatID = this.props.route.params.chatID;
    // eslint-disable-next-line no-underscore-dangle
    const messageID = message._id;

    return fetch('http://localhost:3333/api/1.0.0/chat/' + chatID + '/message/' + messageID, {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      },
      method: 'delete'
    })
      .then((response) => {

        const status = response.status;
        if (status === 200) {

          this.componentDidMount();
          throw 'Message deleted successfully.';

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

  getUserID = async () => {

    AsyncStorage.getItem('whatsthat_user_id').then((id) => {

      this.setState({
        // string -> int conversion
        userID: parseInt(id, 10)
      });

    });

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

        const transformedMessages = responseJson.messages.map((message) => {

          return {
            _id: message.message_id,
            createdAt: message.timestamp,
            text: message.message,
            user: {
              _id: message.author.user_id,
              name: message.author.first_name + ' ' + message.author.last_name
              // avatar: ,
            }
          };

        });

        this.setState({
          isLoading: false,
          chatDetails: transformedMessages
        });

      })
    // Add error message here
      .catch((error) => {

        console.log(error);

      });

  };

  // eslint-disable-next-line class-methods-use-this
  onLongPress = (context, message) => {

    console.log(context, message);
    const options = ['Edit', 'Delete'];
    const deleteButtonIndex = options.length - 1;

    context.actionSheet().showActionSheetWithOptions({
      options,
      deleteButtonIndex
    }, (buttonIndex) => {

      switch (buttonIndex) {

        case 0:
          break;

        case 1:
          this.deleteMessage(message);
          break;

        default:

      }

    });

  };

  renderMessageLongPress() {

    return (
      <TouchableWithoutFeedback onPress={() => { return this.messageLongPressModalVisible(!this.state.messageLongPressModalVisible); }}>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.messageLongPressModalVisible}
          onRequestClose={() => {

            this.messageLongPressModalVisible(!this.state.messageLongPressModalVisible);

          }}
        >
          <View style={{ flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback>

              <View style={{
                backgroundColor: '#2a363b',
                width: '100%',
                height: '15%',
                borderRadius: 10,
                padding: 10
              }}
              >

                <TouchableOpacity
                  style={styles.optionsView}
                  onPress={() => {

                    this.setMessageLongPressModalVisible(!this.state.messageLongPressModalVisible);

                  }}
                >

                  <Text style={{ fontSize: 18, color: '#ffffff' }}>
                    Edit
                  </Text>

                </TouchableOpacity>

                <View style={{ borderBottomColor: '#ffffff', borderBottomWidth: 1 }} />

                <TouchableOpacity
                  style={{ flex: 1, height: 50, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => {

                    this.setMessageLongPressModalVisible(!this.state.messageLongPressModalVisible);

                  }}
                >

                  <Text style={{ fontSize: 18, color: 'red' }}>
                    Delete
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
        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );

    }

    return (

      <View style={{ flex: 1 }}>

        <GiftedChat
          messages={this.state.chatDetails}
          onSend={(messages) => { return this.sendMessage(messages); }}
          user={{
            _id: this.state.userID
          }}
          onLongPress={this.onLongPress}
        />

      </View>

    );

  }

}

const styles = StyleSheet.create({
  optionsView: {
    flex: 1,
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default IndividualChat;