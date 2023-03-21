'use strict';

import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../../styles/global';

class PreviewChat extends Component {

  render() {

    const { image, name, lastMessage } = this.props;

    return (

      <View style={[styles.container, globalStyles.darkBackgroundColor]}>

        <View style={{ flex: 1, marginRight: '5%' }}>
          <Image
            src={{ uri: image }}
            defaultSource={require('../whatsthatlogo.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.detailsContainer}>

          <Text style={styles.name}>
            {name}
          </Text>
          <Text style={styles.lastMessage}>
            {lastMessage}
          </Text>

        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => { return this.props.navigation.navigate('AddContact', { addToChat: true }); }}>
            <Ionicons name="add-outline" size={22} color="#ffffff" style={styles.icon} />
          </TouchableOpacity>
        </View>

      </View>

    );

  }

}

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    padding: '5%'
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: '10%'
  },

  detailsContainer: {
    flex: 7
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: '2%',
    color: '#ffffff'
  },

  lastMessage: {
    fontSize: 14,
    color: '#ffffff'
  }
});

export default PreviewChat;