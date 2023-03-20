'use strict';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import Contacts from '../components/contacts-component';

class BlockedUsersScreen extends Component {

  constructor(props) {

    super(props);

    this.state = {

      isLoading: true,
      blockedUsersList: []

    };

  }

  componentDidMount() {

    // check user is logged in
    this.unsubscribe = this.props.navigation.addListener('focus', () => {

      this.checkLoggedIn();

    });

    this.getBlocked();
    this.props.navigation.setOptions({ title: 'Blocked users' });

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

  getBlocked = async () => {

    return fetch('http://localhost:3333/api/1.0.0/blocked', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      }
    })
      .then((response) => { return response.json(); })
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          blockedUsersList: responseJson
        });

        console.log(this.state.blockedUsersList);

      })
    // Add error message here
      .catch((error) => {

        console.log(error);

      });

  };

  render() {

    if (this.state.isLoading) {

      return (
        <View style={{ justifyContent: 'center', alignContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );

    }

    return (

      <View style={styles.flatListParentView}>

        <FlatList
          data={this.state.blockedUsersList}
          renderItem={({ item }) => {

            return (

              <Contacts id={item.user_id} name={item.first_name + ' ' + item.last_name} blocked={true} getBlockedFunction={this.getBlocked} />

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

export default BlockedUsersScreen;