/* eslint-disable react/jsx-no-bind */

'use strict';

import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../../styles/global';

const validator = require('email-validator');

function Profile(props) {

  const [firstName, setFirstName] = useState(props.firstName);
  const [lastName, setLastName] = useState(props.lastName);
  const [email, setEmail] = useState(props.email);
  const [password, setPassword] = useState('');
  const [failText, setFailText] = useState('');
  const [formComplete, setFormComplete] = useState(false);

  // adding a hook for the formComplete state to run whenever its state is updated
  // initally had the check in validateInputs() but state updates are not reflected immediately so had to create a hook
  useEffect(() => {

    if (formComplete) {

      updateProfile();

    }

  }, [formComplete]);

  const validateInputs = () => {

    const isEmailValid = validator.validate(email);

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$/;
    const isPassValid = passwordRegex.test(password);

    // if else statements to return error message to the user regarding what part of the form is incorrect
    if (!isEmailValid && !isPassValid) {

      setFailText('Email and password are invalid.');

    }
    else if (!isEmailValid) {

      setFailText('Email is invalid.');

    }
    else if (!isPassValid) {

      setFailText('Password is invalid.');

    }

    else {

      setFailText('');
      setFormComplete(true);

    }

    // check if any part of the form is incomplete to override the error message
    if (firstName === ''
        || lastName === ''
        || email === ''
        || password === '') {

      setFailText('Please complete the form.');

    }

    // if (formComplete) {

    //   updateProfile();

    // }

  };

  const updateProfile = async () => {

    const updatedUserData = {
      first_name: firstName,
      last_name: lastName,
      email,
      password
    };

    const id = await AsyncStorage.getItem('whatsthat_user_id');

    return fetch('http://localhost:3333/api/1.0.0/user/' + id, {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify(updatedUserData)
    })
      .then((response) => {

        const { status } = response;
        if (status === 200) {

          props.getProfileFunction();
          throw 'Details updated successfully.';

        }
        else if (status === 500) {

          throw 'Please try again in a bit.';

        }

      })

    // Add error message here
      .catch((error) => {

        setFailText(error);

      });

  };

  return (

    <View style={styles.container}>

      <View style={{ flex: 2, justifyContent: 'center' }}>

        <TouchableOpacity style={{ flex: 1 }} onPress={() => { props.navigation.navigate('Camera'); }}>
          <Image
            source={{ uri: props.image }}
            defaultSource={require('../whatsthatlogo.png')}
            style={styles.image}
          />
        </TouchableOpacity>

      </View>

      <View style={{ flex: 3 }}>

        <View style={{ marginBottom: '5%' }}>
          <Text style={styles.textTitle}> First name </Text>
          <TextInput
            style={[globalStyles.textInput, styles.name, { marginBottom: '0%' }]}
            defaultValue={props.firstName}
            onChangeText={(_firstName) => { return setFirstName(_firstName); }}
          />
        </View>

        <View style={{ marginBottom: '5%' }}>
          <Text style={styles.textTitle}> Last name </Text>
          <TextInput
            style={[globalStyles.textInput, styles.name, { marginBottom: '0%' }]}
            defaultValue={props.lastName}
            onChangeText={(_lastName) => { return setLastName(_lastName); }}
          />
        </View>

        <View style={{ marginBottom: '5%' }}>
          <Text style={styles.textTitle}> Email </Text>
          <TextInput
            style={[globalStyles.textInput, styles.name, { marginBottom: '0%' }]}
            defaultValue={props.email}
            onChangeText={(_email) => { return setEmail(_email); }}
          />
        </View>

        <View style={{ marginBottom: '15%' }}>
          <Text style={styles.textTitle}> Password </Text>
          <TextInput
            style={[globalStyles.textInput, styles.name, { marginBottom: '0%' }]}
            onChangeText={(_password) => { return setPassword(_password); }}
          />
        </View>

        <View style={{ marginBottom: '15%' }}>

          <Text style={globalStyles.failText}>
            {failText}
          </Text>

        </View>

        <View>
          <Button
            color="#2a363b"
            title="Update details"
            onPress={() => { validateInputs(); }}
          />
        </View>

      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: '10%',
    resizeMode: 'contain'
  },

  textTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2a363b'
  },

  name: {
    fontStyle: 'normal'
  },

  buttonContainer: {
    alignSelf: 'flex-end',
    padding: 5,
    margin: 5,
    backgroundColor: 'steelblue'
  }
});

export default Profile;