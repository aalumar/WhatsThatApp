'use strict';

import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../../styles/global';

class PreviewChat extends Component {

  constructor(props) {

    super(props);

    this.state = {

      chatName: '',
      optionsModalVisible: false,
      editChatNameModalVisible: false

    };

  }

  setOptionsModalVisibleState = (visible) => {

    this.setState({
      optionsModalVisible: visible
    });

  };

  setEditChatNameModalVisible = (visible) => {

    this.setState({
      editChatNameModalVisible: visible
    });

    if (visible === false) {

      this.setState({ chatName: '' });

    }

  };

  editChatName = async () => {

    const chatID = this.props.id;
    // eslint-disable-next-line no-underscore-dangle
    const name = {
      name: this.state.chatName
    };

    return fetch('http://localhost:3333/api/1.0.0/chat/' + chatID, {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify(name)
    })
      .then((response) => {

        const { status } = response;
        if (status === 200) {

          this.props.getChatsFunction();
          throw 'Chat name edited successfully.';

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

  renderOptionsModal() {

    return (
      <TouchableWithoutFeedback onPress={() => { return this.setOptionsModalVisibleState(!this.state.optionsModalVisible); }}>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.optionsModalVisible}
          onRequestClose={() => {

            this.setOptionsModalVisibleState(!this.state.optionsModalVisible);

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

                    this.setOptionsModalVisibleState(!this.state.optionsModalVisible);
                    this.props.navigation.navigate('AddContact', { chatID: this.props.id, addToChat: true });

                  }}
                >

                  <Text style={{ fontSize: 18, color: '#ffffff' }}>
                    Add or remove contact
                  </Text>

                </TouchableOpacity>

                <View style={{ borderBottomColor: '#ffffff', borderBottomWidth: 1 }} />

                <TouchableOpacity
                  style={styles.optionsView}
                  onPress={() => {

                    this.setEditChatNameModalVisible(true);
                    this.setOptionsModalVisibleState(!this.state.optionsModalVisible);

                  }}
                >

                  <Text style={{ fontSize: 18, color: '#ffffff' }}>
                    Edit name
                  </Text>

                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </TouchableWithoutFeedback>
    );

  }

  renderEditChatNameModal() {

    return (
      <TouchableWithoutFeedback onPress={() => { return this.setEditChatNameModalVisible(!this.state.editChatNameModalVisible); }}>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.editChatNameModalVisible}
          onRequestClose={() => {

            this.setEditChatNameModalVisible(!this.state.editChatNameModalVisible);

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
                    Enter the new name
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
                  onPress={() => { this.editChatName(); this.setEditChatNameModalVisible(!this.state.editChatNameModalVisible); }}
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

    const { image, name, lastMessage } = this.props;

    return (

      <View style={[styles.container, globalStyles.darkBackgroundColor]}>

        <View style={{ flex: 1, marginRight: '5%' }}>
          <Image
            source={{ uri: image }}
            defaultSource={require('../whatsthatlogo.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.detailsContainer}>

          <Text style={styles.name}>
            {name}
          </Text>
          <Text style={styles.lastMessage}>
            {lastMessage}
          </Text>

        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => { return this.setOptionsModalVisibleState(true); }}>
            <Ionicons name="ellipsis-vertical-outline" size={24} color="#ffffff" style={styles.icon} />
          </TouchableOpacity>
        </View>

        {this.renderOptionsModal()}
        {this.renderEditChatNameModal()}

      </View>

    );

  }

}

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    padding: '5%'
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: '10%'
  },

  detailsContainer: {
    flex: 7
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: '2%',
    color: '#ffffff'
  },

  lastMessage: {
    fontSize: 14,
    color: '#ffffff'
  },

  optionsView: {
    flex: 1,
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default PreviewChat;