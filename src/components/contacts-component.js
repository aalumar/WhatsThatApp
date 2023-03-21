'use strict';

import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../../styles/global';

class Contacts extends Component {

  constructor(props) {

    super(props);

    this.state = {

      optionsModalVisible: false,
      alertUserModalVisible: false,
      isLoading: true,
      userImage: null,
      userMessage: ''

    };

  }

  async componentDidMount() {

    this.setState({
      userImage: await this.getProfileImage()
    });

  }

  setOptionsModalVisibleState = (visible) => {

    this.setState({
      optionsModalVisible: visible
    });

  };

  setAlertUserModalVisibleState = (visible) => {

    this.setState({
      alertUserModalVisible: visible
    });

  };

  removeContact = async (b) => {

    return fetch('http://localhost:3333/api/1.0.0/user/' + this.props.id + '/contact', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      },
      method: 'delete'
    })
      .then((response) => {

        const status = response.status;
        if (status === 200) {

          // if user is removing a contact on the contacts screen, call getContacts()
          // otherwise, they are on the blocked screen, so run getBlocked() instead
          if (!b) {

            this.props.getContactsFunction();

          }
          else {

            this.props.getBlockedFunction();

          }
          throw 'Contact deleted successfully.';

        }
        else if (status === 400) {

          throw 'You can\'t remove yourself!';

        }
        else if (status === 500) {

          throw 'Please try again in a bit.';

        }

      })

    // Add error message here
      .catch((error) => {

        console.log(error);
        this.setState({
          userMessage: error
        });

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
        else if (status === 400) {

          throw 'You can\'t block yourself!';

        }
        else if (status === 500) {

          throw 'Please try again in a bit.';

        }

      })

    // Add error message here
      .catch((error) => {

        console.log(error);
        this.setState({
          userMessage: error
        });

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
        this.setState({
          userMessage: error
        });

      });

  };

  addContact = async () => {

    return fetch('http://localhost:3333/api/1.0.0/user/' + this.props.id + '/contact', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      },
      method: 'post'
    })
      .then((response) => {

        const status = response.status;
        if (status === 200) {

          throw 'Contact added successfully!';

        }
        else if (status === 400) {

          throw 'You can\'t add yourself as a contact!';

        }
        else if (status === 500) {

          throw 'Please try again in a bit.';

        }

      })
    // Add error message here
      .catch((error) => {

        console.log(error);
        this.setState({
          userMessage: error
        });

      });

  };

  addContactToChat = async () => {

    return fetch('http://localhost:3333/api/1.0.0/chat/' + this.props.chatID + '/user/' + this.props.id, {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      },
      method: 'post'
    })
      .then((response) => {

        const status = response.status;
        if (status === 200) {

          throw 'Contact added to chat successfully!';

        }
        else if (status === 500) {

          throw 'Please try again in a bit.';

        }

      })
    // Add error message here
      .catch((error) => {

        console.log(error);
        this.setState({
          userMessage: error
        });

      });

  };

  // eslint-disable-next-line class-methods-use-this
  getProfileImage = async () => {

    return fetch('http://localhost:3333/api/1.0.0/user/' + this.props.id + '/photo', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      }
    })
      .then((response) => {

        return response.blob();

      })
      .then((responseBlob) => {

        const data = URL.createObjectURL(responseBlob);

        this.setState({
          isLoading: false
        });
        return data;

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

                    this.props.add
                      ? this.addContact()
                      : this.removeContact(this.props.blocked);
                    this.setOptionsModalVisibleState(!this.state.optionsModalVisible);
                    this.setAlertUserModalVisibleState(!this.state.alertUserModalVisible);

                  }}
                >
                  { this.props.add
                    ? (
                      <Text style={{ fontSize: 18, color: '#ffffff' }}>
                        Add contact
                      </Text>
                    )
                    : (
                      <Text style={{ fontSize: 18, color: '#ffffff' }}>
                        Remove contact
                      </Text>
                    )}

                </TouchableOpacity>

                <View style={{ borderBottomColor: '#ffffff', borderBottomWidth: 1 }} />

                <TouchableOpacity
                  style={{ flex: 1, height: 50, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => {

                    this.props.blocked
                      ? this.unblockContact()
                      : this.blockContact();
                    this.setOptionsModalVisibleState(!this.state.optionsModalVisible);
                    this.setAlertUserModalVisibleState(!this.state.alertUserModalVisible);

                  }}
                >
                  {/* blocked ternary operator, if true then render the component for the blocked user screen */}
                  { this.props.blocked
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
    );

  }

  renderAlertUserModal() {

    return (
      <TouchableWithoutFeedback onPress={() => { return this.setAlertUserModalVisibleState(!this.state.alertUserModalVisible); }}>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.alertUserModalVisible}
          onRequestClose={() => {

            this.setAlertUserModalVisibleState(!this.state.alertUserModalVisible);

          }}
        >
          <View style={{ flex: 1, backgroundColor: '#000000AA', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback>

              <View style={{
                backgroundColor: '#2a363b',
                width: '70%',
                height: '20%',
                borderRadius: 10,
                padding: '5%',
                alignItems: 'center'
              }}
              >

                <View style={{ justifyContent: 'center', alignItems: 'center', fontSize: 20, marginBottom: '20%' }}>
                  <Text style={[globalStyles.bold, { color: '#ffffff' }]}>
                    {this.state.userMessage}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[globalStyles.pressableRegisterGoBackButton, { width: '70%', backgroundColor: '#4e5559' }]}
                  onPress={() => { return this.setAlertUserModalVisibleState(!this.state.alertUserModalVisible); }}
                >

                  <Text style={globalStyles.registerGoBackText}>
                    OK
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

    // the blocked prop is used to determine whether to render for the contacts screen or blocked users screen
    const { image, name } = this.props;

    if (this.state.isLoading) {

      return (
        <View style={{ justifyContent: 'center', alignContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );

    }

    return (

      <View style={styles.container}>

        <View style={{ flex: 3, flexDirection: 'row' }}>

          <Image
            src={{ uri: this.state.userImage }}
            defaultSource={require('../whatsthatlogo.png')}
            style={styles.image}
          />

          <Text style={styles.name}>
            {name}
          </Text>

        </View>

        { this.props.addToChat
          ? (
            <TouchableOpacity
              style={{ justifyContent: 'flex-end' }}
              onPress={() => {

                this.addContactToChat();
                this.setAlertUserModalVisibleState(true);

              }}
            >
              <Ionicons name="add-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
          )
          : (
            <TouchableOpacity style={{ justifyContent: 'flex-end' }} onPress={() => { this.setOptionsModalVisibleState(true); }}>
              <Ionicons name="ellipsis-vertical-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
          )}

        { this.renderOptionsModal() }
        { this.renderAlertUserModal() }

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