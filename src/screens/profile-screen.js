'use strict';

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Profile from '../components/profile-component';
import globalStyles from '../../styles/global';

function ProfileScreen(props) {

  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState();
  const [userProfileImage, setUserProfileImage] = useState(null);

  useEffect(() => {

    const unsubscribe = props.navigation.addListener('focus', () => {

      checkLoggedIn();
      getProfileImage();

    });

    getProfile();

    return () => {

      unsubscribe();

    };

  }, []);

  // function to check if the user is logged in, otherwise send them back to the login page
  const checkLoggedIn = async () => {

    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null) {

      props.navigation.navigate('Login');

    }

  };

  const getProfile = async () => {

    const id = await AsyncStorage.getItem('whatsthat_user_id');

    return fetch('http://localhost:3333/api/1.0.0/user/' + id, {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      }
    })
      .then((response) => { return response.json(); })
      .then((responseJson) => {

        setUserProfile(responseJson);
        setIsLoading(false);

      })
    // Add error message here
      .catch((error) => {

        console.log(error);

      });

  };

  const getProfileImage = async () => {

    const id = await AsyncStorage.getItem('whatsthat_user_id');

    return fetch('http://localhost:3333/api/1.0.0/user/' + id + '/photo', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      }
    })
      .then((response) => { return response.blob(); })
      .then((responseBlob) => {

        const data = URL.createObjectURL(responseBlob);
        console.log(data);
        setUserProfileImage(data);

      })
    // Add error message here
      .catch((error) => {

        console.log(error);

      });

  };

  if (isLoading) {

    return (
      <View style={{ justifyContent: 'center', alignContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );

  }

  return (

    <View style={globalStyles.flexContainer}>

      <Profile
        id={userProfile.user_id}
        firstName={userProfile.first_name}
        lastName={userProfile.last_name}
        email={userProfile.email}
        image={userProfileImage}
        getProfileFunction={getProfile}
        navigation={props.navigation}
      />

    </View>

  );

}

export default ProfileScreen;