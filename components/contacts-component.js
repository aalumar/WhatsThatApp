'use strict';

import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu';
import globalStyles from '../styles/global';

class Contacts extends Component {

    render () {

        const {image, name} = this.props

        return (

        <View style={styles.container}>

            <View style={{flex: 3, flexDirection: 'row'}}>

                <Image 
                source={require('./whatsthatlogo.png')}
                style={styles.image}
                />

                <Text style={styles.name}> {name} </Text>

            </View>

            <View style={{justifyContent: 'flex-end'}}>
            
                <MenuProvider style={{flex: 1, paddingTop: 10}}>
                    <Menu>
                        <MenuTrigger>
                            <Ionicons name="ellipsis-vertical-outline" size={24} color="#ffffff" />
                        </MenuTrigger>

                        <MenuOptions>
                            <MenuOption text="Delete"/>
                            <MenuOption text="Block"/>
                        </MenuOptions>
                    </Menu>
                </MenuProvider>

            </View>

        </View>

        )
    }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'row',
    padding: '5%',
    backgroundColor: '#2a363b'
  },

  image: {
    width: '12%',
    height: '100%',
    borderRadius: '10%',
    marginRight: '5%',
    resizeMode: 'center'
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff'
  }
})

export default Contacts