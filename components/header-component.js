'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';

class Header extends Component {

  constructor(props) {

    super(props);

    this.state = {
      
    };

  }

  render () {

    const { SlideInMenu } = renderers;

    return (

      <View style={styles.container}>

        <TouchableOpacity> 
          <Ionicons name="search-outline" size={28} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="add-outline" size={28} color="#ffffff" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity>
          <MenuProvider>
            <Menu renderer={SlideInMenu}>
              <MenuTrigger>
                <Ionicons name="ellipsis-vertical-outline" size={28} color="#ffffff" style={styles.icon} />
              </MenuTrigger>

              <MenuOptions>
                <MenuOption text="View blocked users"/>
                <MenuOption>
                  <Text style={{color: 'red'}}> Logout </Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </MenuProvider>
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
    backgroundColor: '#2a363b',
    },

  icon: {
    marginLeft: 20
  }

})

export default Header