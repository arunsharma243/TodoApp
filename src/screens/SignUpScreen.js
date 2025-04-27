import { Alert, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
const SignUpScreen = () => {
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [confirmPassword,setConfirmPassword]=useState('')

    const navigation=useNavigation()
    const registerUser=()=>{
    auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential=>{
      const {uid}=userCredential.user
      return firestore()
      .collection('users')
      .doc(uid)
      .set({
        name,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
        uid
      });
  })
  .then(()=>{
    console.log("user created")
    navigation.navigate('Login')
    emptyFields()
  })
     .catch(error=>{
      console.log(error)
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Registration Failed', 'This email address is already in use.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Weak Password', 'Password should be at least 6 characters.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    })
    }
    const emptyFields=()=>{
      setName('')
      setEmail('')
      setMobile('')
      setPassword('')
      setConfirmPassword('')
    }
    const validate=()=>{
      if (!name || !email || !password || !confirmPassword) {
        Alert.alert('Error','All fields are required.');
        return false;
      }
      if(confirmPassword!==password){
        Alert.alert('Error','Password and Confirm Password should be same.')
        return false;
      }
      return true
    }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
       placeholder="Enter Name"
       value={name}
       onChangeText={setName}
       style={styles.input}
      />
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
      <TextInput
       placeholder="Enter Confirm Password"
       value={confirmPassword}
       onChangeText={setConfirmPassword}
       style={styles.input}
       secureTextEntry={true}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={()=>{
          if(validate())
            registerUser()
        }}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.login}
       onPress={()=>{
        navigation.navigate('Login')
       }}
       >
        Or Login</Text>
    </View>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    title:{
        color:'#9395d3',
        fontSize:30,
        alignSelf:'center',
        marginTop:100,
        fontWeight:'700',
        marginBottom:40
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
    login:{
        alignSelf:'center',
        marginTop:50,
        fontSize:20,
        textDecorationLine:'underline',
        fontWeight:'600',
        color:'#9395d3'
    }
})