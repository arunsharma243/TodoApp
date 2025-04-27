import { Alert, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'


const LoginScreen = () => {
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const navigation=useNavigation()

    const loginUser=()=>{
      if (!email || !password) {
        Alert.alert('Missing Fields', 'Please enter both email and password.');
        return;
      }
      auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const { uid } = userCredential.user;
  
        // Fetch user data from Firestore
        return firestore()
          .collection('users')
          .doc(uid)
          .get();
      })
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          const userData = documentSnapshot.data();
          console.log('Logged-in user data:', userData);
          goToNext(userData.uid,userData.name)
        }
      })
      .catch((error) => {
        // setVisible(false)
        console.error('Login error:', error);
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Invalid Email', 'Please enter a valid email address.');
        } else if (error.code === 'auth/user-not-found') {
          Alert.alert('No Account', 'No account found with this email.');
        } else if (error.code === 'auth/invalid-credential') {
          Alert.alert('Invalid Credentials', 'The email or password is incorrect.');
        }  else {
          Alert.alert('Error', 'Something went wrong. Please try again.');
        }
      });
      
    }
    const goToNext=async(userId,name)=>{
      await AsyncStorage.setItem('NAME',name)
      await AsyncStorage.setItem('USERID',userId)
      navigation.navigate('Home')
      
      emptyFields()
    }
    const emptyFields=()=>{
      setEmail('')
      setPassword('')
    }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <TextInput
       placeholder="Enter Email"
       value={email}
       onChangeText={setEmail}
       style={styles.input}
      />
      <TextInput
       placeholder="Enter Password"
       value={password}
       onChangeText={setPassword}
       style={styles.input}
       secureTextEntry={true}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={()=>{
          loginUser()
        }}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.signup}
            onPress={()=>{
             navigation.navigate('SignUp')
            }}
            >
        Or Sign Up</Text>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    title:{
        color:'black',
        fontSize:30,
        alignSelf:'center',
        marginTop:100,
        fontWeight:'700',
        marginBottom:40,
        color:'#9395d3'
    },
    input:{
        borderRadius:10,
        borderBottomWidth:3,
        width:'90%',
        alignSelf:'center',
        paddingHorizontal:10,
        marginBottom:20,
        borderBottomColor:'#d8d6d6'
    },
    button:{
        width:'90%',
        height:50,
        borderRadius:10,
        alignSelf:'center',
        backgroundColor:'#9395d3',
        justifyContent:'center',
        alignItems:'center'
    },
    buttonText:{
        color:'white',
        fontSize:20
    },
    signup:{
        alignSelf:'center',
        marginTop:50,
        fontSize:20,
        textDecorationLine:'underline',
        fontWeight:'600',
        color:'#9395d3'
    }
})