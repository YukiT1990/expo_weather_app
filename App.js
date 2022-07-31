import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native';
import * as Location from 'expo-location';
import { key } from './Api_key.js';
import { weather_background } from './weather.js';

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
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={weather_background[location.weather[0].icon]} resizeMode="cover" style={styles.image}>
        {errorMsg !== null && (
          <Text>There's been an error: {errorMsg}</Text>
        )}
        {errorMsg === null && location !== null && (
          <>
            <Text style={styles.top_text}>{location.name}</Text>
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png`
              }}
              style={{ width: 200, height: 200 }}
            />
          </>
        )}
        {errorMsg === null && location === null && (
          <Text>Waiting...</Text>
        )}
        <StatusBar style="auto" />
      </ImageBackground>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    width: "100%"
  },
  top_text: {
    fontWeight: "bold",
    fontSize: 36,
    color: 'white',
  }
});
