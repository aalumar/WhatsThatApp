'use strict';

import React, { Component } from 'react';
import { Text, View, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import Contacts from './contacts-component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/global';

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
      this.checkLoggedIn()
    })

    this.getContacts()
  }

  componentWillUnmount() {
    // close listener to avoid memory leakage
    this.unsubscribe()
  }

  // function to check if the user is logged in, otherwise send them back to the login page
  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('whatsthat_session_token')
    if (value == null) {
      this.props.navigation.navigate('Login')
    }
  }

  getContacts = async () => {

    return fetch("http://localhost:3333/api/1.0.0/contacts", {
      headers: {
        "X-Authorization": await AsyncStorage.getItem('whatsthat_session_token')
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {

      this.setState({
        isLoading: false,
        contactsList: responseJson
      })
      console.log(this.state.contactsList)
    })
    // Add error message here
    .catch((error) => {
      console.log(error)
    })

  }

  render () {

    if(this.state.isLoading) {
      return (
        <View style={{justifyContent: 'center', alignContent: 'center'}}>
          <ActivityIndicator />
        </View>
      )
    }

    else{
      return (

        <View style={styles.flatListParentView}>

          <FlatList
          data={this.state.contactsList}
          renderItem={({item}) =>

            <Contacts name={item.first_name + " " + item.last_name}/>

          }

          keyExtractor = {({id}, index) => id}

          />

        </View>

      )
    }
  }
}

const styles = StyleSheet.create({
  flatListParentView: {
    flex: 1,
    backgroundColor: '#99b898'
  }
})

export default ContactsScreen