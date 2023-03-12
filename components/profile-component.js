'use strict';

import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';

class Profile extends Component {

    render () {

        const {image, name, email} = this.props

        return (

        <View style={styles.container}>

            <View style={{flex: 2, justifyContent: 'center'}}>

                <TouchableOpacity style={{flex: 1}}>
                  <Image 
                    src={{uri: image}}
                    defaultSource={require('./whatsthatlogo.png')}
                    style={styles.image}
                  />
                </TouchableOpacity>

            </View>

            <View style={{flex: 2}}>

                <View style={{marginBottom: '10%'}}>
                    <Text style={styles.textTitle}> Name </Text>
                    <Text style={styles.name}> {name} </Text>
                </View>

                <View>
                    <Text style={styles.textTitle}> Email </Text>
                    <Text style={styles.name}> {email} </Text>
                </View>

            </View>

        </View>

        )
    }
}

const styles = StyleSheet.create({

  container: {
    flex: 1
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: '10%',
    resizeMode: 'center'
  },

  textTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2a363b'
  },

  name: {
    fontSize: 16,
    color: '#ffffff'
  }
})

export default Profile