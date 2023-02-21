import React, { Component, useState } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';
var validator = require("email-validator");

// Functional component method

const App = () => {

  const [emailText, setEmailState] = useState("");
  const [passText, setPassState] = useState("");
  const [failText, setFailTextState] = useState("");

  const loginClick = (email, pass) => {

    const isEmailValid = validator.validate(email);
    console.log(isEmailValid);

    const password_regex = new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$');
    const isPassValid = password_regex.test(pass);
    console.log(isPassValid);

    if (!isEmailValid || !isPassValid) {
      
      setFailTextState("Invalid credentials.");

    }
  }

  return (

    <View>

      <TextInput
        placeholder = "Enter your email"
        value = {emailText}
        onChangeText = {emailText => setEmailState(emailText)}
      />

      <TextInput
      placeholder = "Enter your password"
      secureTextEntry = {true}
      value = {passText}
      onChangeText = {passText => setPassState(passText)} 
      />

      <Button
        title = {"Log in"}
        onPress = {loginClick(emailText, passText)}
      />

      <Text>
        {failText}
      </Text>
              
    </View>

  );

}