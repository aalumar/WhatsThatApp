'use strict';

import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import globalStyles from '../styles/global';

class HomeScreen extends Component {

  constructor(props) {

    super(props);

    this.state = {
      
    };

  }

  render () {

    return (

      <View style={styles.flexContainer}>

        <Text style={[styles.title, globalStyles.bold]}> Home screen </Text>

      </View>

    )
  }
}

const styles = StyleSheet.create({

  flexContainer: {
    flex: 1,
    backgroundColor: '#99b898',
    justifyContent: 'center',
    alignItems: 'center'
  },

  title: {
    color: '#daf0e0',
    fontFamily: 'Helvetica',
    fontSize: 32
  }
})

export default HomeScreen