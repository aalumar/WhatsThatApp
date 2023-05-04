/* eslint-disable react/jsx-no-bind */

import React, { useState } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

function CameraScreen() {

  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState(null);
  // const [permission, requestPermission] = Camera.useCameraPermissions();
  const navigation = useNavigation();

  function toggleCameraType() {

    setType((current) => { return (current === CameraType.back ? CameraType.front : CameraType.back); });
    console.log('Camera: ', type);

  }

  async function takePhoto() {

    if (camera) {

      const options = { quality: 0.5, base64: true, onPictureSaved: (data) => { return sendToServer(data); } };
      const data = await camera.takePictureAsync(options);

    }

    async function sendToServer(data) {

      const id = await AsyncStorage.getItem('whatsthat_user_id');

      const res = await fetch(data.base64);
      const blob = await res.blob();

      return fetch('http://localhost:3333/api/1.0.0/user/' + id + '/photo', {
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
          'Content-Type': 'image/png'
        },
        method: 'post',
        body: blob
      })
        .then((response) => {

          navigation.goBack();

          const { status } = response;
          if (status === 200) {

            throw 'Photo uploaded successfully.';

          }
          else if (status === 500) {

            throw 'Please try again in a bit.';

          }

        })

      // Add error message here
        .catch((error) => {

          console.log(error);

        });

    }

  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={(ref) => { return setCamera(ref); }}>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Ionicons name="camera-reverse-outline" size={42} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.takePhoto}>
          <TouchableOpacity onPress={() => { takePhoto(); }}>
            <Feather name="circle" size={100} color="#ffffff" />
          </TouchableOpacity>
        </View>

      </Camera>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    padding: '2%',
    backgroundColor: 'transparent'
  },
  button: {
    width: '100%',
    height: '100%'
  },
  takePhoto: {
    height: '90%',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});

export default CameraScreen;