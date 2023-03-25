'use strict';

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contacts from '../components/contacts-component';

function ContactsScreen(props) {

  const [isLoading, setIsLoading] = useState(true);
  const [contactsList, setContactsList] = useState([]);

  useEffect(() => {

    const unsubscribe = props.navigation.addListener('focus', () => {

      checkLoggedIn();
      getContacts();

    });

    return () => {

      unsubscribe();

    };

  }, []);

  // function to check if the user is logged in, otherwise send them back to the login page
  const checkLoggedIn = async () => {

    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null) {

      props.navigation.navigate('Login');

    }

  };

  const getContacts = async () => {

    return fetch('http://localhost:3333/api/1.0.0/contacts', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      }
    })
      .then((response) => { return response.json(); })
      .then((responseJson) => {

        setIsLoading(false);
        setContactsList(responseJson);

      })

    // Add error message here
      .catch((error) => {

        console.log(error);

      });

  };

  // eslint-disable-next-line class-methods-use-this
  const getProfileImage = async (id) => {

    return fetch('http://localhost:3333/api/1.0.0/user/' + id + '/photo', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      }
    })
      .then((response) => { return response.blob(); })
      .then((responseBlob) => {

        const data = URL.createObjectURL(responseBlob);
        return data;

      })
    // Add error message here
      .catch((error) => {

        console.log(error);

      });

  };

  if (isLoading) {

    return (
      <View style={{ flex: 1, backgroundColor: '#99b898', justifyContent: 'center', alignContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );

  }

  return (

    <View style={styles.flatListParentView}>

      <FlatList
        data={contactsList}
        renderItem={({ item }) => {

          const image = getProfileImage(item.user_id);

          return (

            <Contacts
              id={item.user_id}
              name={item.first_name + ' ' + item.last_name}
              image={image}
              blocked={false}
              getContactsFunction={getContacts}
            />
          );

        }}
        keyExtractor={({ id }) => { return id; }}
      />

    </View>

  );

}

const styles = StyleSheet.create({
  flatListParentView: {
    flex: 1,
    backgroundColor: '#99b898'
  }
});

export default ContactsScreen;