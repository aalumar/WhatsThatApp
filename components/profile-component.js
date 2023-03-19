'use strict';

import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/global';

const validator = require('email-validator');

class Profile extends Component {

  constructor(props) {

    super(props);

    this.state = {
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      email: this.props.email,
      password: '',
      failText: '',
      formComplete: false
    };

  }

  validateInputs = () => {

    const isEmailValid = validator.validate(this.state.email);

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$/;
    const isPassValid = passwordRegex.test(this.state.password);

    // if else statements to return error message to the user regarding what part of the form is incorrect
    if (!isEmailValid && !isPassValid) {

      this.setState({ failText: 'Email and password are invalid.' });

    }
    else if (!isEmailValid) {

      this.setState({ failText: 'Email is invalid.' });

    }
    else if (!isPassValid) {

      this.setState({ failText: 'Password is invalid.' });

    }

    else {

      this.setState({ failText: '' });
      this.state.formComplete = true;

    }

    // check if any part of the form is incomplete to override the error message
    if (this.state.firstName === ''
        || this.state.lastName === ''
        || this.state.email === ''
        || this.state.password === '') {

      this.setState({ failText: 'Please complete the form.' });

    }

    if (this.state.formComplete) {

      this.updateProfile();

    }

  };

  updateProfile = async () => {

    const updatedUserData = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      password: this.state.password
    };

    console.log(updatedUserData);

    return fetch('http://localhost:3333/api/1.0.0/user/' + id, {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify(updatedUserData)
    })
      .then((response) => {

        const status = response.status;

        if (status === 200) {

          this.props.getProfileFunction();
          throw 'Details updated successfully.';

        }
        else if (status === 500) {

          throw 'Please try again in a bit.';

        }

      })

    // Add error message here
      .catch((error) => {

        this.setState({ failText: error });

      });

  };

  render() {

    return (

      <View style={styles.container}>

        <View style={{ flex: 2, justifyContent: 'center' }}>

          <TouchableOpacity style={{ flex: 1 }}>
            {console.log(this.props.image)}
            <Image
              src={{ uri: this.props.image }}
              defaultSource={require('./whatsthatlogo.png')}
              style={styles.image}
            />
          </TouchableOpacity>

        </View>

        <View style={{ flex: 3 }}>

          <View style={{ marginBottom: '5%' }}>
            <Text style={styles.textTitle}> First name </Text>
            <TextInput
              style={[globalStyles.textInput, styles.name, { marginBottom: '0%' }]}
              defaultValue={this.props.firstName}
              onChangeText={(firstName) => { return this.setState({ firstName }); }}
            />
          </View>

          <View style={{ marginBottom: '5%' }}>
            <Text style={styles.textTitle}> Last name </Text>
            <TextInput
              style={[globalStyles.textInput, styles.name, { marginBottom: '0%' }]}
              defaultValue={this.props.lastName}
              onChangeText={(lastName) => { return this.setState({ lastName }); }}
            />
          </View>

          <View style={{ marginBottom: '5%' }}>
            <Text style={styles.textTitle}> Email </Text>
            <TextInput
              style={[globalStyles.textInput, styles.name, { marginBottom: '0%' }]}
              defaultValue={this.props.email}
              onChangeText={(email) => { return this.setState({ email }); }}
            />
          </View>

          <View style={{ marginBottom: '15%' }}>
            <Text style={styles.textTitle}> Password </Text>
            <TextInput
              style={[globalStyles.textInput, styles.name, { marginBottom: '0%' }]}
              onChangeText={(password) => { return this.setState({ password }); }}
            />
          </View>

          <View style={{ marginBottom: '15%' }}>

            <Text style={globalStyles.failText}>
              {this.state.failText}
            </Text>

          </View>

          <View>
            <Button
              color="#2a363b"
              title="Update details"
              // disabled={true}
              onPress={() => { this.validateInputs(); }}
            />
          </View>

        </View>

      </View>

    );

  }

}

const styles = StyleSheet.create({

  container: {
    flex: 1
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: '10%',
    resizeMode: 'center'
  },

  textTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2a363b'
  },

  name: {
    fontStyle: 'normal'
  }
});

export default Profile;