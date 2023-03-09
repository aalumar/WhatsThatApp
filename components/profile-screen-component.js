'use strict';

import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import globalStyles from '../styles/global';

class ProfileScreen extends Component {

  constructor(props) {

    super(props);

    this.state = {
      
    };

  }

  render () {

    return (

      <View style={globalStyles.flexContainer}>

        <Text style={globalStyles.title}> Profile screen </Text>

      </View>

    )
  }
}

const styles = StyleSheet.create({
})

export default ProfileScreen