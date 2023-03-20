'use strict';

import React, { Component } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import globalStyles from '../../styles/global';

class PreviewChat extends Component {

  render() {

    const { image, name, lastMessage } = this.props;

    return (

      <View style={[styles.container, globalStyles.darkBackgroundColor]}>

        <Image
          src={{ uri: image }}
          defaultSource={require('../whatsthatlogo.png')}
          style={styles.image}
        />

        <View style={styles.detailsContainer}>

          <Text style={styles.name}>
            {name}
          </Text>
          <Text style={styles.lastMessage}>
            {lastMessage}
          </Text>

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
    width: '12%',
    height: '100%',
    borderRadius: '10%',
    marginRight: '5%'
  },

  detailsContainer: {
    flex: 1
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