'use strict';

import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/global-styles';

var validator = require("email-validator");

// Class component method

class LoginScreen extends Component {

  constructor(props) {

    super(props);

    this.state = {
      email: "",
      password: "",
      failText: ""
    };

  }

  /** 
   * Function to run after 'Login' button is clicked.
   * Will validate form and call login() if passes successfully.
   */
  loginClick = () => {

    const isEmailValid = validator.validate(this.state.email);
    console.log(isEmailValid);

    const password_regex = new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$');
    const isPassValid = password_regex.test(this.state.password);
    console.log(isPassValid);

    // if else statements to return error message to the user regarding what part of the form is incorrect
    if (!isEmailValid) {
      this.setState({failText: "Email is invalid."})
    }
    else if(!isPassValid) {
      this.setState({failText: "Password is invalid."})
    }
    else {
      this.setState({failText:""})
      console.log("Good to go.")
      this.state.formComplete = true
    }

    if (this.state.email == "" || this.state.password == "") {
      this.setState({failText: "Please complete the form."})
    }


    if (this.state.formComplete) {
      this.login()
    }

  }


  /** 
   * Function that is called if validation from loginClick() passes.
   * Uses Fetch API to make a call to the server that takes the user to the home screen page if the user is logged in successfully.
   */
  login = () => {

    // create user data using state variables to send to server
    let user = {
      email: this.state.email,
      password: this.state.password
    }

    return fetch("http://localhost:3333/api/1.0.0/login", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then(response => {

      const status = response.status

      if (status === 200) {
        
        const rJson = response.json()

        .then(async (rJson) => {

          console.log(rJson)

          try {
            await AsyncStorage.setItem("whatsthat_user_id", rJson.id)
            await AsyncStorage.setItem("whatsthat_session_token", rJson.token)
            
            this.props.navigation.navigate('Home')
  
          } catch {
            throw "Please try again later. If problem persists, try clearing your cache."
          }

        })
       
      }
      else if(status === 400) {
        throw "Email or password is invalid."
      }
      else {
        throw "There is a problem on our side. Please try again in a bit."
      }
    })
    .catch((error) => {
      this.setState({failText: error})
    })
  }

  render () {

    return (

      <View style={styles.flexContainer}>
        
        <LinearGradient colors={['rgba(44, 138, 69, 0.8)', 'transparent']} style={styles.linearBG}>
      
          { /*Title view*/ }
          <View style={{flex: 3, justifyContent: 'center'}}>

            <Text style={[styles.title, globalStyles.bold]}>
                What's That?
            </Text>

          </View>

          { /*Form detail view*/ }
          <View style={{ justifyContent: 'flex-end', flex: 2 }}>

            <View style={{marginBottom: '5%'}}>

              <TextInput
                style = {[styles.textInput, globalStyles.italic]}
                placeholder = "Enter your email..."
                value = {this.state.email}
                onChangeText = {(email) => this.setState({email})}
              />
                
              <TextInput
                style = {[styles.textInput, globalStyles.italic]}
                placeholder = "Enter your password..."
                secureTextEntry = {true}
                value = {this.state.password}
                onChangeText = {(password) => this.setState({password})}
              />

            </View>

            <Button color='#2a363b'
              title = "Log in"
              onPress = {() => this.loginClick()}
            />

          </View>

          { /*Footer/error message view*/ }
          <View style={{flex: 1}}>

            <Text style={[{color: '#b52f2f'}, [globalStyles.helvetica, globalStyles.bold]]}>
                {this.state.failText}
            </Text>

          </View>

          <View style={{flex: 1}}>
            <Pressable style={styles.registerButton}
                       onPress={() => this.props.navigation.navigate('Register')}>
              <Text 
              style={[{ color: 'white', fontFamily: 'Helvetica'}, globalStyles.underline]}>
                  NO ACCOUNT? REGISTER HERE
              </Text>
            </Pressable>
          </View>

        </LinearGradient>

      </View>

    );
  }
}

const styles = StyleSheet.create({

  flexContainer: {
    flex: 1,
    backgroundColor: '#99b898',
    justifyContent: 'center',
    alignItems: 'center'
  },

  linearBG: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  title: {
    color: '#daf0e0',
    fontFamily: 'Helvetica',
    fontSize: 32
  },

  textInput: {
    borderWidth: 2,
    borderColor: '#2a363b',
    borderRadius: 10,
    marginBottom: '5%',
    padding: '4%',
    fontSize: 16,
    fontFamily: 'Candara'
  },

  registerButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: '#2a363b'
  }
})

export default LoginScreen