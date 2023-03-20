'use strict';

import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

class Contacts extends Component {

  constructor(props) {

    super(props);

    this.state = {

      modalVisible: false

    };

  }

  setModalVisibleState = (visible) => {

    this.setState({
      modalVisible: visible
    });

  };

  removeContact = async () => {

    return fetch('http://localhost:3333/api/1.0.0/user/' + this.props.id + '/contact', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      },
      method: 'delete'
    })
      .then((response) => {

        const status = response.status;
        if (status === 200) {

          this.props.getContactsFunction();
          throw 'Contact deleted successfully.';

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

  blockContact = async () => {

    return fetch('http://localhost:3333/api/1.0.0/user/' + this.props.id + '/block', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      },
      method: 'post'
    })
      .then((response) => {

        const status = response.status;
        if (status === 200) {

          this.props.getContactsFunction();
          throw 'Contact blocked successfully.';

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

  unblockContact = async () => {

    return fetch('http://localhost:3333/api/1.0.0/user/' + this.props.id + '/block', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      },
      method: 'delete'
    })
      .then((response) => {

        const status = response.status;
        if (status === 200) {

          this.props.getBlockedFunction();
          throw 'Contact unblocked successfully.';

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

  render() {

    // the blocked prop is used to determine whether to render for the contacts screen or blocked users screen
    const { image, name, blocked } = this.props;

    return (

      <View style={styles.container}>

        <View style={{ flex: 3, flexDirection: 'row' }}>

          <Image
            src={{ uri: image }}
            defaultSource={require('../whatsthatlogo.png')}
            style={styles.image}
          />

          <Text style={styles.name}>
            {name}
          </Text>

        </View>

        <TouchableOpacity style={{ justifyContent: 'flex-end' }} onPress={() => { this.setModalVisibleState(true); }}>
          <Ionicons name="ellipsis-vertical-outline" size={24} color="#ffffff" />
        </TouchableOpacity>

        <TouchableWithoutFeedback onPress={() => { return this.setModalVisibleState(!this.state.modalVisible); }}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {

              this.setModalVisibleState(!this.state.modalVisible);

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

                      this.setModalVisibleState(!this.state.modalVisible);
                      this.removeContact();

                    }}
                  >

                    <Text style={{ fontSize: 18, color: '#ffffff' }}>
                      Remove contact
                    </Text>

                  </TouchableOpacity>

                  <View style={{ borderBottomColor: '#ffffff', borderBottomWidth: 1 }} />

                  <TouchableOpacity
                    style={{ flex: 1, height: 50, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {

                      this.setModalVisibleState(!this.state.modalVisible);
                      blocked
                        ? this.unblockContact()
                        : this.blockContact();

                    }}
                  >
                    {/* blocked ternary operator, if true then render the component for the blocked user screen */}
                    { blocked
                      ? (
                        <Text style={{ fontSize: 18, color: 'red' }}>
                          Unblock contact
                        </Text>
                      )
                      : (
                        <Text style={{ fontSize: 18, color: 'red' }}>
                          Block contact
                        </Text>
                      )}

                  </TouchableOpacity>

                </View>
              </TouchableWithoutFeedback>
            </View>
          </Modal>
        </TouchableWithoutFeedback>

        {/* <View style={{ justifyContent: 'flex-end' }}>

          <MenuProvider style={{ flex: 1, paddingTop: 10 }}>
            <Menu>
              <MenuTrigger>
                <Ionicons name="ellipsis-vertical-outline" size={24} color="#ffffff" />
              </MenuTrigger>

              <MenuOptions>
                <MenuOption text="Delete" />
                <MenuOption text="Block" />
              </MenuOptions>

            </Menu>
          </MenuProvider>

        </View> */}

      </View>

    );

  }

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'row',
    padding: '5%',
    backgroundColor: '#2a363b'
  },

  image: {
    width: '12%',
    height: '100%',
    borderRadius: '10%',
    marginRight: '5%',
    resizeMode: 'center'
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff'
  },

  optionsView: {
    flex: 1,
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Contacts;