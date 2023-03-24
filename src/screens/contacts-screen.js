'use strict';

import React, { Component } from 'react';
import { View, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contacts from '../components/contacts-component';

class ContactsScreen extends Component {

  constructor(props) {

    super(props);

    this.state = {

      isLoading: true,
      contactsList: []

    };

  }

  componentDidMount() {

    // check user is logged in
    this.unsubscribe = this.props.navigation.addListener('focus', () => {

      this.checkLoggedIn();
      this.getContacts();

    });

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

  getContacts = async () => {

    return fetch('http://localhost:3333/api/1.0.0/contacts', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      }
    })
      .then((response) => { return response.json(); })
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          contactsList: responseJson
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
        <View style={[styles.flatListParentView, { justifyContent: 'center', alignContent: 'center' }]}>
          <ActivityIndicator />
        </View>
      );

    }

    return (

      <View style={styles.flatListParentView}>

        <FlatList
          data={this.state.contactsList}
          renderItem={({ item }) => {

            return (

              <Contacts
                id={item.user_id}
                name={item.first_name + ' ' + item.last_name}
                blocked={false}
                getContactsFunction={this.getContacts}
              />
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

export default ContactsScreen;