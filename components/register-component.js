'use strict';

import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import globalStyles from '../styles/global';

var validator = require("email-validator");

// Class component method

class RegisterScreen extends Component {

  constructor(props) {

    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
      failText: "",
      formComplete: false
    };

  }

  /**
   * Function to run after 'Register' button is clicked.
   * Will validate form and call addUser() if passes successfully.
   */
  registerClick = () => {

    const isEmailValid = validator.validate(this.state.email)

    const password_regex = new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$')
    const isPassValid = password_regex.test(this.state.password)
    
    // if else statements to return error message to the user regarding what part of the form is incorrect
    if (!isEmailValid && !isPassValid) {
      this.setState({failText: "Email and password are invalid."})
    }
    else if (!isEmailValid) {
      this.setState({failText: "Email is invalid."})
    }
    else if(!isPassValid) {
      this.setState({failText: "Password is invalid."})
    }
    else if(this.state.password != this.state.passwordConfirm) {
      this.setState({failText: "Passwords do not match."})
    }
    else {
      this.setState({failText:""})
      console.log("Good to go.")
      this.state.formComplete = true
    }


    // check if any part of the form is incomplete to override the error message
    if (this.state.firstName == "" ||
        this.state.lastName == "" ||
        this.state.email == "" ||
        this.state.password == "" ||
        this.state.passwordConfirm == "") {
          this.setState({failText: "Please complete the form."})
    }

    if (this.state.formComplete) {
      this.addUser()
    }
  }

  /**
   * Function that is called if validation from registerClick() passes.
   * Uses Fetch API to make a call to the server that takes the user to the login page if the user is created successfully.
   */
  addUser = () => {

    // create user data using state variables to send to server
    let userData = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      password: this.state.password
    }

    console.log(userData)

    return fetch("http://localhost:3333/api/1.0.0/user", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    .then(response => {

      const status = response.status
      console.log(status)

      if(status === 201) {
        console.log("User created")
        this.props.navigation.navigate('Login')
      }
      else if(status === 400) {
        throw "An account associated with that email already exists."
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

      <View style={globalStyles.flexContainer}>
        
        <LinearGradient colors={['rgba(44, 138, 69, 0.8)', 'transparent']} style={globalStyles.linearBG}>
      
          { /*Title view*/ }
          <View style={{flex: 3, justifyContent: 'space-evenly'}}>

            <Text style={globalStyles.title}>
                What's That?
            </Text>

            {/* <Image
              source={require('./whatsthatlogo.png')}
              style={globalStyles.logo}
            /> */}

          </View>

          { /*Form detail view*/ }
          <View style={{flex: 2 , justifyContent: 'flex-end'}}>

            <View style={{marginBottom: '5%'}}>

                <TextInput
                    style = {globalStyles.textInput}
                    placeholder = "First name..."
                    value = {this.state.firstName}
                    onChangeText = {(firstName) => this.setState({firstName})}
                />
                
                <TextInput
                    style = {globalStyles.textInput}
                    placeholder = "Last name..."
                    value = {this.state.lastName}
                    onChangeText = {(lastName) => this.setState({lastName})}
                />

                <TextInput
                    style = {globalStyles.textInput}
                    placeholder = "Email..."
                    value = {this.state.email}
                    onChangeText = {(email) => this.setState({email})}
                />
                    
                <TextInput
                    style = {globalStyles.textInput}
                    placeholder = "Password..."
                    secureTextEntry = {true}
                    value = {this.state.password}
                    onChangeText = {(password) => this.setState({password})}
                />

                <TextInput
                    style = {globalStyles.textInput}
                    placeholder = "Confirm password..."
                    secureTextEntry = {true}
                    value = {this.state.passwordConfirm}
                    onChangeText = {(passwordConfirm) => this.setState({passwordConfirm})}
                />

            </View>

            <Button color='#2a363b'
              title = "Register"
              onPress = {() => this.registerClick()}
            />

          </View>

          { /*Footer/error message view*/ }
          <View style={{flex: 1}}>

            <Text style={globalStyles.failText}>
                {this.state.failText}
            </Text>

          </View>

          <View style={{flex: 1}}>
            { /* the navigation is implemented this way to reset the login page's states*/ }
            <Pressable style={globalStyles.pressableRegisterGoBackButton}
                      onPress={() => this.props.navigation.reset({ 
                        routes:[{name: 'Login'}]
                       })}>
              <Text 
              style={globalStyles.registerGoBackText}>
                  GO BACK
              </Text>
            </Pressable>
          </View>

        </LinearGradient>

      </View>

    );
  }
}

const styles = StyleSheet.create({
})

export default RegisterScreen