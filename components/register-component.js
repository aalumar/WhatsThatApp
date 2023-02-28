'use strict';

import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import globalStyles from '../styles/global-styles';

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
      passwordConfirm: ""
    };

  }

  registerClick = () => {

    const isEmailValid = validator.validate(this.state.email);
    console.log(isEmailValid);

    const password_regex = new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$');
    const isPassValid = password_regex.test(this.state.password);
    console.log(isPassValid);

    if (!isEmailValid || !isPassValid) {
      this.setState({failText: "Invalid credentials."})
    }
    else {
      this.setState({failText: "Good to go."})
    }

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
                    placeholder = "Enter your first name..."
                    value = {this.state.firstName}
                    onChangeText = {(firstName) => this.setState({firstName})}
                />
                
                <TextInput
                    style = {[styles.textInput, globalStyles.italic]}
                    placeholder = "Enter your last name..."
                    value = {this.state.lastName}
                    onChangeText = {(lastName) => this.setState({lastName})}
                />

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

                <TextInput
                    style = {[styles.textInput, globalStyles.italic]}
                    placeholder = "Confirm your password..."
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

            <Text style={{ color: 'red', fontFamily: 'Helvetica'}}>
                {this.state.failText}
            </Text>

          </View>

          <View style={{flex: 1}}>
            <Pressable style={styles.backButton}
                       onPress={() => this.props.navigation.navigate('Login')}>
              <Text 
              style={[{ color: 'white', fontFamily: 'Helvetica'}, globalStyles.underline]}>
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

  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: '#2a363b'
  }
})

export default RegisterScreen