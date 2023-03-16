'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, TextInput, Button, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';

class Header extends Component {

  constructor(props) {

    super(props);

    this.state = {

      modalVisible: false,
      addFriendSearch: ''

    };

  }

  setModalVisibleState = (visible) => {

    this.setState({
      modalVisible: visible,
      addFriendSearch: ''
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
        // console.log(status);

        if (status === 200) {

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

    const { SlideInMenu } = renderers;

    return (

      <View style={styles.container}>

        <TouchableOpacity>
          <Ionicons name="search-outline" size={28} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { this.setModalVisibleState(true); }}>
          <Ionicons name="add-outline" size={28} color="#ffffff" style={styles.icon} />
        </TouchableOpacity>

        {/* TouchableWithoutFeedback is used twice here, the first is to close the Modal when clicking outside of it
          The second prevents the Modal from closing when clicking inside of it */}
        <TouchableWithoutFeedback onPress={() => { return this.setModalVisibleState(!this.state.modalVisible); }}>
          <Modal
            animationType="fade"
            transparent
            visible={this.state.modalVisible}
            onRequestClose={() => {

              this.setModalVisibleState(!this.state.modalVisible);

            }}
          >
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.innerContainer}>
                  <Text style={styles.title}>Send a friend request</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter friend's email address"
                    onChangeText={(addFriendSearch) => { return this.setState({ addFriendSearch }); }}
                    value={this.state.addFriendSearch}
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

        <TouchableOpacity>
          <MenuProvider>
            <Menu renderer={SlideInMenu}>
              <MenuTrigger>
                <Ionicons name="ellipsis-vertical-outline" size={28} color="#ffffff" style={styles.icon} />
              </MenuTrigger>

              <MenuOptions>
                <MenuOption text="View blocked users" />
                <MenuOption onSelect={() => { return this.Logout(); }}>
                  <Text style={{ color: 'red' }}> Logout </Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </MenuProvider>
        </TouchableOpacity>

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
    color: '#fff',
    fontWeight: 'bold'
  }

});

export default Header;