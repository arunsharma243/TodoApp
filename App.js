import React, { useEffect } from 'react';
import {StatusBar, StyleSheet,Text,View} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import notifee from '@notifee/react-native';
import { NavigationContainer } from '@react-navigation/native'
function App(){


    useEffect(() => {
      const setupNotificationChannel = async () => {
        await notifee.requestPermission(); // ask for permission (Android 13+)
        await notifee.createChannel({
          id: 'default_channel',
          name: 'Default Channel',
          importance: 4, // Importance.HIGH
          sound:'default'
        });
      };
  
      setupNotificationChannel();
  },[])
  
  return (
    <>
     <StatusBar backgroundColor='#9395d3'/>
     <NavigationContainer>
     <AppNavigator/>
     </NavigationContainer>
     
    </>
   
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
