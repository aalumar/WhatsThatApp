'use strict';

import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import globalStyles from '../styles/global';

class Header extends Component {

  constructor(props) {

    super(props);

    this.state = {
      
    };

  }

  render () {

    return (

      <View style={styles.flexContainer}>

        <Text> + </Text>
        <Text>  </Text>
        <Text> Logout </Text>

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
  }

})

export default Header