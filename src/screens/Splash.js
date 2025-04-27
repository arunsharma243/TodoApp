import { Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Splash = () => {
  const navigation=useNavigation()

  useEffect(()=>{
      setTimeout(()=>{
        checkLogin()
      },2000)
  },[])
  const checkLogin=async()=>{
    const id=await AsyncStorage.getItem("USERID")
    if(id){
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }else{
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }
  return (
    <>
     <StatusBar backgroundColor='#d6d7ef' barStyle={'dark-content'}/>
     <View style={styles.container}>
      <Image source={require('../images/logo.png')} style={styles.logo}/>
    </View>
    </>
    
  )
}

export default Splash

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#d6d7ef',
    flex:1, 
    justifyContent:'center',
    alignItems:'center',
    paddingBottom:100
  },
  logo:{
    width:100,
    height:100,
    resizeMode:'contain',
    padding:100
  }
})