'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

class Header extends Component {

  constructor(props) {

    super(props);

    this.state = {
      
    };

  }

  render () {

    return (

      <View style={styles.container}>

        <TouchableOpacity> 
          <Ionicons name="search-outline" size={28} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="add-outline" size={28} color="#ffffff" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical-outline" size={28} color="#ffffff" style={styles.icon} />
        </TouchableOpacity>
        
      </View>

    )
  }
}

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    backgroundColor: '#2a363b'
    },

  icon: {
    marginLeft: 20
  }

})

export default Header