'use strict';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

class DraftedMessagesScreen extends Component {

  constructor(props) {

    super(props);

    this.state = {

    };

  }

  componentDidMount() {

    // check user is logged in
    this.unsubscribe = this.props.navigation.addListener('focus', () => {

      this.checkLoggedIn();
      this.props.navigation.setOptions({ title: 'Drafted messages' });

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

  render() {

    return (

      <View style={styles.flatListParentView} />

    );

  }

}

const styles = StyleSheet.create({

  flatListParentView: {
    flex: 1,
    backgroundColor: '#99b898'
  }

});

export default DraftedMessagesScreen;