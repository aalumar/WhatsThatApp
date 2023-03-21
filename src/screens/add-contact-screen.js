'use strict';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity } from 'react-native';
import Contacts from '../components/contacts-component';
import globalStyles from '../../styles/global';

class AddContactScreen extends Component {

  constructor(props) {

    super(props);

    this.state = {

      isLoading: false,
      contactsList: [],
      searchQuery: ''

    };

  }

  componentDidMount() {

    // check user is logged in
    this.unsubscribe = this.props.navigation.addListener('focus', () => {

      this.checkLoggedIn();

    });

    this.props.navigation.setOptions({ title: 'Search users' });

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

  searchContacts = async () => {

    this.setState({
      isLoading: true
    });

    return fetch('http://localhost:3333/api/1.0.0/search?q=' + this.state.searchQuery, {
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

    return (

      <View style={{ flex: 1, backgroundColor: '#99b898' }}>

        <View style={{ flex: 1, alignItems: 'center' }}>

          <TextInput
            style={[globalStyles.textInput, { width: '70%', marginTop: '10%', marginBottom: '10%', fontStyle: 'normal' }]}
            placeholder="Enter name or email address"
            onChangeText={(searchQuery) => { return this.setState({ searchQuery }); }}
            value={this.state.searchQuery}
          />

          <TouchableOpacity
            style={globalStyles.pressableRegisterGoBackButton}
            onPress={() => { return this.searchContacts(); }}
          >

            <Text style={globalStyles.registerGoBackText}>
              SEARCH
            </Text>

          </TouchableOpacity>

        </View>

        <View style={{ flex: 3 }}>

          { this.state.isLoading ? <ActivityIndicator /> : (

            <FlatList
              data={this.state.contactsList}
              renderItem={({ item }) => {

                return (

                  <Contacts
                    id={item.user_id}
                    name={item.given_name + ' ' + item.family_name}
                    blocked={false}
                    add={true}
                    addToChat={this.props.route.params.addToChat}
                  />

                );

              }}
              keyExtractor={({ id }) => { return id; }}

            />
          )}

        </View>

      </View>

    );

  }

}

export default AddContactScreen;