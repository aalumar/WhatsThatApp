/* eslint-disable camelcase */
// Disabling due to message_id which is a naming scheme from the API

'use strict';

import React, { Component } from 'react';
import { View, ActivityIndicator, TouchableWithoutFeedback, TouchableOpacity, Modal, Text, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GiftedChat } from 'react-native-gifted-chat';
import globalStyles from '../../styles/global';

class IndividualChat extends Component {

  constructor(props) {

    super(props);

    this.state = {

      isLoading: true,
      chatDetails: [],
      userID: null,
      selectedMessage: null,
      updatedMessage: '',
      messageLongPressModalVisible: false,
      intervalID: null

    };

    this.onSend = this.onSend.bind(this);

  }

  async componentDidMount() {

    // check user is logged in
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {

      this.checkLoggedIn();

    });

    this.state.intervalID = setInterval(async () => {

      await this.getMessages();

    }, 2000);

    // Updating header title of stack navigator to the chat's name
    this.props.navigation.setOptions({ title: this.props.route.params.chatName });

    if (this.state.userID === null) {

      await this.getUserID();

    }

    // await this.getMessages();

  }

  componentWillUnmount() {

    // close listener to avoid memory leakage
    clearInterval(this.state.intervalID);
    this.unsubscribe();

  }

  setMessageLongPressModalVisible = (visible) => {

    this.setState({
      messageLongPressModalVisible: visible
    });

    if (visible === false) {

      this.setState({
        updatedMessage: ''
      });

    }

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

    const { chatID } = this.props.route.params;
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

        const { status } = response;
        if (status === 200) {

          this.onSend();
          this.getMessages();
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

    const { chatID } = this.props.route.params;
    // eslint-disable-next-line no-underscore-dangle
    const messageID = message._id;

    return fetch('http://localhost:3333/api/1.0.0/chat/' + chatID + '/message/' + messageID, {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      },
      method: 'delete'
    })
      .then((response) => {

        const { status } = response;
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

  editMessage = async () => {

    const { chatID } = this.props.route.params;
    // eslint-disable-next-line no-underscore-dangle
    const messageID = this.state.selectedMessage._id;
    const message = {
      message: this.state.updatedMessage
    };

    return fetch('http://localhost:3333/api/1.0.0/chat/' + chatID + '/message/' + messageID, {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify(message)
    })
      .then((response) => {

        const { status } = response;
        if (status === 200) {

          this.componentDidMount();
          throw 'Message edited successfully.';

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

    const { chatID } = this.props.route.params;

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
          this.setState({ selectedMessage: message });
          this.setMessageLongPressModalVisible(true);
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

      <TouchableWithoutFeedback onPress={() => { return this.setMessageLongPressModalVisible(!this.state.messageLongPressModalVisible); }}>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.messageLongPressModalVisible}
          onRequestClose={() => {

            this.setMessageLongPressModalVisible(!this.state.messageLongPressModalVisible);

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
                    Enter the new message
                  </Text>
                </View>

                <View style={{ marginTop: '10%', marginBottom: '10%' }}>
                  <TextInput
                    style={[globalStyles.textInput, { width: '100%', borderColor: '#ffffff', fontStyle: 'normal', color: '#ffffff' }]}
                    placeholder="Enter new message"
                    onChangeText={(updatedMessage) => { return this.setState({ updatedMessage }); }}
                    value={this.state.updatedMessage}
                  />
                </View>

                {/* add edit message functions call here */}
                <TouchableOpacity
                  style={[globalStyles.pressableRegisterGoBackButton, { width: '70%', backgroundColor: '#4e5559' }]}
                  onPress={() => { this.setMessageLongPressModalVisible(!this.state.messageLongPressModalVisible); this.editMessage(); }}
                >

                  <Text style={globalStyles.registerGoBackText}>
                    EDIT
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

        {this.renderMessageLongPress()}

      </View>

    );

  }

}

export default IndividualChat;