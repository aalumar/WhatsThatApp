'use strict';

import React, { Component } from 'react';
import { Text, TextInput, Image, View, Button, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../../styles/global';

const validator = require('email-validator');

class LoginScreen extends Component {

  constructor(props) {

    super(props);

    this.state = {
      email: '',
      password: '',
      failText: ''
    };

  }

  /**
   * Function to run after 'Login' button is clicked.
   * Will validate form and call login() if passes successfully.
   */
  loginClick = () => {

    const isEmailValid = validator.validate(this.state.email);

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$/;
    const isPassValid = passwordRegex.test(this.state.password);

    // if else statements to return error message to the user regarding what part of the form is incorrect
    if (!isEmailValid) {

      this.setState({ failText: 'Email is invalid.' });

    }
    else if (!isPassValid) {

      this.setState({ failText: 'Password is invalid.' });

    }
    else {

      this.setState({ failText: '' });
      this.state.formComplete = true;

    }

    if (this.state.email === '' || this.state.password === '') {

      this.setState({ failText: 'Please complete the form.' });

    }

    if (this.state.formComplete) {

      this.login();

    }

  };

  /**
   * Function that is called if validation from loginClick() passes.
   * Uses Fetch API to make a call to the server that takes the user to the home screen page if the user is logged in successfully.
   */
  login = () => {

    // create user data using state variables to send to server
    const user = {
      email: this.state.email,
      password: this.state.password
    };

    return fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then((response) => {

        const status = response.status;

        if (status === 200) {

          return response.json();

        }
        else if (status === 400) {

          throw 'Email or password is invalid.';

        }
        else {

          throw 'There is a problem on our side. Please try again in a bit.';

        }

      })
      .then(async (rJson) => {

        try {

          await AsyncStorage.setItem('whatsthat_user_id', rJson.id);
          await AsyncStorage.setItem('whatsthat_session_token', rJson.token);

          this.props.navigation.navigate('Chats');

        }

        catch {

          throw 'Please try again later. If problem persists, try clearing your cache.';

        }

      })
      .catch((error) => {

        this.setState({ failText: error });

      });

  };

  render() {

    return (

      <View style={globalStyles.flexContainer}>

        <LinearGradient
          colors={['rgba(44, 138, 69, 0.8)', 'transparent']}
          style={globalStyles.linearBG}
        >

          { /* Title view */ }
          <View style={{ flex: 3, justifyContent: 'space-evenly' }}>

            <Text style={globalStyles.title}>
              What's That?
            </Text>

            <Image
              source={require('../whatsthatlogo.png')}
              style={globalStyles.logo}
            />

          </View>

          { /* Form detail view */ }
          <View style={{ flex: 2, justifyContent: 'flex-end' }}>

            <View style={{ marginBottom: '5%' }}>

              <TextInput
                style={globalStyles.textInput}
                placeholder="Email..."
                value={this.state.email}
                onChangeText={(email) => { return this.setState({ email }); }}
              />

              <TextInput
                style={globalStyles.textInput}
                placeholder="Password..."
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={(password) => { return this.setState({ password }); }}
              />

            </View>

            <Button
              color="#2a363b"
              title="Log in"
              onPress={() => { return this.loginClick(); }}
            />

          </View>

          { /* Footer/error message view */ }
          <View style={{ flex: 1 }}>

            <Text style={globalStyles.failText}>
              {this.state.failText}
            </Text>

          </View>

          <View style={{ flex: 1 }}>
            <Pressable
              style={globalStyles.pressableRegisterGoBackButton}
              onPress={() => { return this.props.navigation.navigate('Register'); }}
            >
              <Text style={globalStyles.registerGoBackText}>
                NO ACCOUNT? REGISTER HERE
              </Text>
            </Pressable>
          </View>

        </LinearGradient>

      </View>

    );

  }

}

export default LoginScreen;