'use strict';

import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Profile from '../components/profile-component';
import globalStyles from '../../styles/global';

class ProfileScreen extends Component {

  constructor(props) {

    super(props);

    this.state = {

      isLoading: true,
      userProfile: {},
      userProfileImage: null

    };

  }

  componentDidMount() {

    // check user is logged in
    this.unsubscribe = this.props.navigation.addListener('focus', () => {

      this.checkLoggedIn();

    });

    this.getProfileImage();
    this.getProfile();

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

  getProfile = async () => {

    const id = await AsyncStorage.getItem('whatsthat_user_id');

    return fetch('http://localhost:3333/api/1.0.0/user/' + id, {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      }
    })
      .then((response) => { return response.json(); })
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          userProfile: responseJson
        });

      })
    // Add error message here
      .catch((error) => {

        console.log(error);

      });

  };

  getProfileImage = async () => {

    const id = await AsyncStorage.getItem('whatsthat_user_id');

    return fetch('http://localhost:3333/api/1.0.0/user/' + id + '/photo', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      }
    })
      .then((response) => { return response.blob(); })
      .then((responseBlob) => {

        const data = URL.createObjectURL(responseBlob);

        this.setState({
          userProfileImage: data
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
        <View style={{ justifyContent: 'center', alignContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );

    }

    return (

      <View style={globalStyles.flexContainer}>

        <Profile
          id={this.state.userProfile.user_id}
          firstName={this.state.userProfile.first_name}
          lastName={this.state.userProfile.last_name}
          email={this.state.userProfile.email}
          image={this.state.userProfileImage}
          getProfileFunction={this.getProfile}
        />

      </View>

    );

  }

}

export default ProfileScreen;