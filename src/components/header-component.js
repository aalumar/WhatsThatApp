'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, TextInput, Button, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

class Header extends Component {

  constructor(props) {

    super(props);

    this.state = {

      addFriendModal: false,
      addFriendModalSearch: '',
      optionsModalVisible: false

    };

  }

  static renderSeparator = () => {

    <View style={{
      opacity: 0.1,
      backgroundColor: '#182E44',
      height: 1
    }}
    />;

  };

  setAddFriendModalVisibleState = (visible) => {

    this.setState({
      addFriendModal: visible,
      addFriendModalSearch: ''
    });

  };

  setOptionsModalVisibleState = (visible) => {

    this.setState({
      optionsModalVisible: visible
    });

  };

  Logout = async () => {

    return fetch('http://localhost:3333/api/1.0.0/logout', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      },
      method: 'post'
    })
      .then((response) => {

        const status = response.status;

        if (status === 200) {

          AsyncStorage.removeItem('whatsthat_user_id');
          AsyncStorage.removeItem('whatsthat_session_token');

          this.props.navigation.reset({

            routes: [{ name: 'Login' }]

          });

        }
        else if (status === 401) {

          throw 'Email or password is invalid.';

        }
        else {

          throw 'There is a problem on our side. Please try again in a bit.';

        }

      })
      .catch((error) => {

        console.log(error);
        // this.setState({failText: error})

      });

  };

  render() {

    return (

      <View style={styles.container}>

        {/* SEARCH */}
        <TouchableOpacity>
          <Ionicons name="search-outline" size={28} color="#ffffff" />
        </TouchableOpacity>

        {/* ADD */}
        <TouchableOpacity onPress={() => { this.setAddFriendModalVisibleState(true); }}>
          <Ionicons name="add-outline" size={28} color="#ffffff" style={styles.icon} />
        </TouchableOpacity>

        {/* TouchableWithoutFeedback is used twice here, the first is to close the Modal when clicking outside of it
          The second prevents the Modal from closing when clicking inside of it */}
        <TouchableWithoutFeedback onPress={() => { return this.setAddFriendModalVisibleState(!this.state.addFriendModal); }}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.addFriendModal}
            onRequestClose={() => {

              this.setAddFriendModalVisibleState(!this.state.addFriendModal);

            }}
          >
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.innerContainer}>
                  <Text style={styles.title}>Send a friend request</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter friend's email address"
                    onChangeText={(addFriendModalSearch) => { return this.setState({ addFriendModalSearch }); }}
                    value={this.state.addFriendModalSearch}
                  />

                  {/* <TouchableHighlight
                    style={styles.button}
                    onPress={() => this.findFriend()}>

                    <Text style={styles.buttonText}>Send</Text>

                  </TouchableHighlight> */}

                  <Button
                    color="#2a363b"
                    title="SEND"
                    onPress={() => { return this.findFriend(); }}
                  />

                </View>
              </TouchableWithoutFeedback>
            </View>
          </Modal>
        </TouchableWithoutFeedback>

        {/* OPTIONS */}
        <TouchableOpacity onPress={() => { this.setOptionsModalVisibleState(true); }}>
          <Ionicons name="ellipsis-vertical-outline" size={28} color="#ffffff" style={styles.icon} />
        </TouchableOpacity>

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

                      this.props.navigation.navigate('BlockedUsers');
                      this.setOptionsModalVisibleState(!this.state.optionsModalVisible);

                    }}
                  >

                    <Text style={{ fontSize: 18, color: '#ffffff' }}>
                      View blocked users
                    </Text>

                  </TouchableOpacity>

                  <View style={{ borderBottomColor: '#ffffff', borderBottomWidth: 1 }} />

                  <TouchableOpacity
                    style={{ flex: 1, height: 50, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => { this.Logout(); }}
                  >

                    <Text style={{ fontSize: 18, color: 'red' }}>
                      Logout
                    </Text>

                  </TouchableOpacity>

                </View>
              </TouchableWithoutFeedback>
            </View>
          </Modal>
        </TouchableWithoutFeedback>

      </View>

    );

  }

}

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    backgroundColor: '#2a363b'
  },

  icon: {
    marginLeft: 20
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },

  innerContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20
  },

  closeButton: {
    alignSelf: 'flex-end',
    fontSize: 20,
    fontWeight: 'bold'
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    width: '100%'
  },

  button: {
    backgroundColor: '#2a363b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold'
  },

  optionsView: {
    flex: 1,
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  }

});

export default Header;