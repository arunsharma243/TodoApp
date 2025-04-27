import { FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import TodoCard from '../components/TodoCard'
import SortDropdown from '../components/SortDropdown'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SortOptions from '../components/SortOptions'
// import RNPickerSelect from 'react-native-picker-select';
const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0); // 12:00 AM today

const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999); // 11:59 PM today


const HomeScreen = () => {
    const [name,setName]=useState('')
    const [data,setData]=useState([])
    const [sortBy,setSortBy]=useState('createdAt')
    const [refreshing, setRefreshing] = useState(false);

   const navigation=useNavigation()
    const route=useRoute()
    const userCredential=route.params
    // console.log("kjdsnj",userCredential)
    useEffect(()=>{
        // setSortBy('createdAt')
        fetchData()
    },[sortBy])

console.log(name)
    const fetchData=async (option)=>{
        const uid=await AsyncStorage.getItem("USERID")
        const name=await AsyncStorage.getItem("NAME")
        setName(name)
        setRefreshing(true)
        console.log("USERID=",uid)
        console.log("jsnx",sortBy)
        
        firestore()
        .collection('tasks')
        .where('uid', '==', uid)
        .orderBy(sortBy, 'asc')
        .get()
        .then((querySnapshot) => {
          const tasks = [];
          querySnapshot.forEach(doc => {
            const data = doc.data();
            const reminderTime = data.reminderTime?.toDate(); // Convert Firestore timestamp to JS Date
        
            if (reminderTime && reminderTime >= startOfDay && reminderTime <= endOfDay) {
              tasks.push({ id: doc.id, ...data });
            }
          });
          console.log("current user tasks",tasks);
          setData(tasks)
          setRefreshing(false)
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
          });
 }
  //    const handleAdd= async()=>{
  //       const uid=await AsyncStorage.getItem("USERID")
  //       firestore()
  // .collection('tasks')
  // .add({
  //   uid: uid,
  //   title: todo,
  //   status: 'INCOMPLETE',
  //   reminderTime: new Date(),
  //   createdAt: firestore.FieldValue.serverTimestamp(),
  // });
  //  fetchData()
  // setTodo('')

  //   //    const copyData=[...data]
  //   //    copyData.push(todo)
  //   //    setData(copyData)
  //    }
     const handleSortBy=(option)=>{
        setSortBy(option)
        // setTimeout(()=>{
        //   fetchData()
        // },0)  
     }
    //  console.log("option2",sortBy)
     const renderItem = ({ item }) => (
        <TodoCard
          task={item}
        //   onToggleStatus={() => onToggleStatus(item.id)}
          onDelete={() => onDelete(item.id)}
          fetchData={fetchData}
        />
      );
      // const handleLogOut=async()=>{
      //      await AsyncStorage.removeItem("USERID")
      //      navigation.navigate('Login')
      // }
      const onDelete = async (taskId) => {
        try {
          await firestore().collection('tasks').doc(taskId).delete();
          fetchData()
          console.log('Task deleted!');
        } catch (error) {
          console.error('Error deleting task: ', error);
        }
      }
  return (
    <>
       <StatusBar backgroundColor='#9395d3'/>
    <View style={styles.container}> 
      {/* <SortDropdown selectedOption={sortBy} onSelect={setSortBy} /> */}
      <View style={{flexDirection:'row',justifyContent:'flex-end',height:70}}>
        {/* <Text>{name}'s tasks</Text> */}
        <SortOptions selectedOption={sortBy} onSelect={handleSortBy}/>
        {/* <TouchableOpacity onPress={handleSortBy}>
        <Text>Sort By</Text>
      </TouchableOpacity> */}
      </View>
      
      {/* <TouchableOpacity onPress={handleLogOut}>
        <Text>LOGOUT</Text>
      </TouchableOpacity> */}
      {/* {
        data.map((item)=>(
            <View style={{borderWidth:1}} key={item.id}>
                <Text>{item.title}</Text>
                <Text>{item.status}</Text>
            </View>
        ))
      } */}
      <FlatList
        data={data}
        renderItem={renderItem}
        style={{marginVertical:60}}
        keyExtractor={item => item.id}
        refreshing={refreshing}
        onRefresh={fetchData}
      />
      <View style={styles.addContainer}>
        {/* <TextInput
          style={styles.input}
          placeholder='Add a new todo item'
          value={todo}
          onChangeText={setTodo}
        /> */}
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={()=>navigation.navigate('AddTask')}
        >
           <Ionicons name="add" size={30} color="white" />
        {/* <Text style={styles.addButtonText}>+</Text> */}
      </TouchableOpacity>
      </View>
    </View>
    </>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'flex-end',
        backgroundColor:'#d6d7ef'
    },
    addContainer:{
        flexDirection:'row',
    },
    input:{
        borderWidth:1,
        borderRadius:10,
        marginHorizontal:20,
        width:'70%',
        
    },
    addButton:{
      position: 'absolute',
      bottom: 30,
      right: 20,
      backgroundColor: '#9395d3', // iOS Blue
      width: 60,
      height: 60,
      borderRadius: 30, // Makes it a perfect circle
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5, // Android shadow
      shadowColor: '#000', // iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    addButtonText:{
        fontSize:50,
        alignSelf:'center',
        color:'white',
        justifyContent:'center',
        alignItems:'center'
    }
})