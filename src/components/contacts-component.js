'use strict';

import React, { useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../../styles/global';

function Contacts(props) {

  const [optionsModalVisible, setOptionsModalVisibleState] = useState(false);
  const [alertUserModalVisible, setAlertUserModalVisibleState] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [userMessage, setUserMessage] = useState('');

  const removeContact = async (b) => {

    return fetch('http://localhost:3333/api/1.0.0/user/' + props.id + '/contact', {
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

            props.getContactsFunction();

          }
          else {

            props.getBlockedFunction();

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
        setUserMessage(error);

      });

  };

  const blockContact = async () => {

    return fetch('http://localhost:3333/api/1.0.0/user/' + props.id + '/block', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      },
      method: 'post'
    })
      .then((response) => {

        const status = response.status;
        if (status === 200) {

          props.getContactsFunction();
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
        setUserMessage(error);

      });

  };

  const unblockContact = async () => {

    return fetch('http://localhost:3333/api/1.0.0/user/' + props.id + '/block', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      },
      method: 'delete'
    })
      .then((response) => {

        const status = response.status;
        if (status === 200) {

          props.getBlockedFunction();
          throw 'Contact unblocked successfully.';

        }
        else if (status === 500) {

          throw 'Please try again in a bit.';

        }

      })
    // Add error message here
      .catch((error) => {

        console.log(error);
        setUserMessage(error);

      });

  };

  const addContact = async () => {

    return fetch('http://localhost:3333/api/1.0.0/user/' + props.id + '/contact', {
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
        setUserMessage(error);

      });

  };

  const addContactToChat = async () => {

    return fetch('http://localhost:3333/api/1.0.0/chat/' + props.chatID + '/user/' + props.id, {
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
        setUserMessage(error);

      });

  };

  const removeContactFromChat = async () => {

    return fetch('http://localhost:3333/api/1.0.0/chat/' + props.chatID + '/user/' + props.id, {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      },
      method: 'delete'
    })
      .then((response) => {

        const status = response.status;
        if (status === 200) {

          throw 'Contact removed from chat successfully!';

        }
        else if (status === 500) {

          throw 'Please try again in a bit.';

        }

      })
    // Add error message here
      .catch((error) => {

        console.log(error);
        setUserMessage(error);

      });

  };

  const getProfileImage = async () => {

    return fetch('http://localhost:3333/api/1.0.0/user/' + props.id + '/photo', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      }
    })
      .then((response) => { return response.blob(); })
      .then((responseBlob) => {

        const data = URL.createObjectURL(responseBlob);

        setLoading(false);
        return data;

      })
    // Add error message here
      .catch((error) => {

        console.log(error);

      });

  };

  const renderAddOrRemoveContact = () => {

    // render the component with the remove icon if a user exists in the chat
    // otherwise render the plus icon to add them to the chat
    if (props.userExistsInChat) {

      return (
        <TouchableOpacity
          style={{ justifyContent: 'flex-end' }}
          onPress={() => {

            removeContactFromChat();
            setAlertUserModalVisibleState(true);

          }}
        >
          <Ionicons name="remove" size={24} color="#ffffff" />
        </TouchableOpacity>
      );

    }

    return (
      <TouchableOpacity
        style={{ justifyContent: 'flex-end' }}
        onPress={() => {

          addContactToChat();
          setAlertUserModalVisibleState(true);

        }}
      >
        <Ionicons name="add-outline" size={24} color="#ffffff" />
      </TouchableOpacity>
    );

  };

  const renderOptionsModal = () => {

    return (
      <TouchableWithoutFeedback onPress={() => { return setOptionsModalVisibleState(!optionsModalVisible); }}>

        <Modal
          animationType="fade"
          transparent={true}
          visible={optionsModalVisible}
          onRequestClose={() => {

            setOptionsModalVisibleState(!optionsModalVisible);

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

                    props.add
                      ? addContact()
                      : removeContact(props.blocked);
                    setOptionsModalVisibleState(!optionsModalVisible);
                    setAlertUserModalVisibleState(!alertUserModalVisible);

                  }}
                >
                  { props.add
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
                  style={styles.optionsView}
                  onPress={() => {

                    props.blocked
                      ? unblockContact()
                      : blockContact();
                    setOptionsModalVisibleState(!optionsModalVisible);
                    setAlertUserModalVisibleState(!alertUserModalVisible);

                  }}
                >
                  {/* blocked ternary operator, if true then render the component for the blocked user screen */}
                  { props.blocked
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

  };

  const renderAlertUserModal = () => {

    return (
      <TouchableWithoutFeedback onPress={() => { return setAlertUserModalVisibleState(!alertUserModalVisible); }}>

        <Modal
          animationType="fade"
          transparent={true}
          visible={alertUserModalVisible}
          onRequestClose={() => {

            setAlertUserModalVisibleState(!alertUserModalVisible);

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
                  <Text style={[globalStyles.bold, { color: '#ffffff', textAlign: 'center' }]}>
                    {userMessage}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[globalStyles.pressableRegisterGoBackButton, { width: '70%', backgroundColor: '#4e5559' }]}
                  onPress={() => { return setAlertUserModalVisibleState(!alertUserModalVisible); }}
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

  };

  return (

  // the blocked prop is used to determine whether to render for the contacts screen or blocked users screen

    isLoading ? (

      <View style={{ justifyContent: 'center', alignContent: 'center' }}>
        <ActivityIndicator />
      </View>

    )
      : (

        <View style={styles.container}>

          <View style={{ flex: 3, flexDirection: 'row' }}>

            <Image
              source={{ uri: props.image }}
              defaultSource={require('../whatsthatlogo.png')}
              style={styles.image}
            />

            <Text style={styles.name}>
              {props.name}
            </Text>

          </View>

          {

            props.addToChat
              ? (
                renderAddOrRemoveContact()
              )
              : (
                <TouchableOpacity style={{ justifyContent: 'flex-end' }} onPress={() => { setOptionsModalVisibleState(true); }}>
                  <Ionicons name="ellipsis-vertical-outline" size={24} color="#ffffff" />
                </TouchableOpacity>
              )

          }

          { renderOptionsModal() }
          { renderAlertUserModal() }

        </View>

      )
  );

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