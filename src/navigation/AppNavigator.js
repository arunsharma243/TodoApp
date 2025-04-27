import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Splash from '../screens/Splash'
import LoginScreen from '../screens/LoginScreen'
import SignUpScreen from '../screens/SignUpScreen'
import HomeScreen from '../screens/HomeScreen'
import AddTaskScreen from '../screens/AddTaskScreen'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'

const Stack=createNativeStackNavigator()

const AppNavigator = () => {
  const handleLogout=async(navigation)=>{
    await AsyncStorage.removeItem("USERID")
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  } 

  const confirmLogout=(navigation)=>{
          console.log("delete1")
          Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Logout', style: 'destructive', onPress: () => handleLogout(navigation) },
            ]
          );
        };
  return (
        <Stack.Navigator>
            <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}}/>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown:false}}/>
            <Stack.Screen 
                 name="Home" 
                 component={HomeScreen} 
                 options={({navigation})=>({
                     title:"TODAY's TASK",
                     headerStyle: {
                      backgroundColor: '#9395d3', 
                    },
                    headerTintColor: '#fff', 
                    headerTitleStyle: {
                      fontWeight: 'bold', 
                      fontSize: 24,
                    },
                    headerLeft:() => null,
                    headerRight: () => (
                      <TouchableOpacity onPress={()=>confirmLogout(navigation)} style={{ marginRight: 15 }}>
                        <MaterialIcons name="logout" color="#fff" size={20} />
                      </TouchableOpacity>
                    ),
                  })}/>
            <Stack.Screen 
            name="AddTask" 
            component={AddTaskScreen} 
            options={({navigation})=>({
              title:"ADD TASK",
              headerStyle: {
               backgroundColor: '#9395d3', 
             },
             headerTintColor: '#fff', 
             headerTitleStyle: {
               fontWeight: 'bold', 
               fontSize: 24,
             },
             headerLeft:() => null,
            })}/>
        </Stack.Navigator>
  )
}

export default AppNavigator

const styles = StyleSheet.create({})