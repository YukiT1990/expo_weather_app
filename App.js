import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as Location from 'expo-location';
import { key } from './Api_key.js';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const API_key = key;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg("Permission denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});

      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=${API_key}`, {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          setLocation(json);
        })
        .catch((error) => {
          console.log(error);
        })

      // setLocation(loc);
    })();
  }, []);

  if (errorMsg !== null) {
    // there's been an error
    return (
      <View style={styles.container}>
        <Text>There's been an error: {errorMsg}</Text>
        <StatusBar style="auto" />
      </View>
    );
  } else if (location !== null) {
    // success
    return (
      <View style={styles.container}>
        {/* <Text>{JSON.stringify(location)}</Text> */}
        <Text>{location.name}</Text>
        <Image
          source={{
            uri: `https://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png`
          }}
          style={{ width: 200, height: 200 }}
        />
        <StatusBar style="auto" />
      </View>
    );
  } else {
    // waiting
    return (
      <View style={styles.container}>
        <Text>Waiting...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
