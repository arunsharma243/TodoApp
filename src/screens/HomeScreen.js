import { FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import TodoCard from '../components/TodoCard'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SortOptions from '../components/SortOptions'
import Loader from '../components/Loader'

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
    useEffect(()=>{
        fetchData()
    },[sortBy])

    const fetchData=async (option)=>{
        const uid=await AsyncStorage.getItem("USERID")
        const name=await AsyncStorage.getItem("NAME")
        setName(name)
        setRefreshing(true)
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
     const handleSortBy=(option)=>{
        setSortBy(option) 
     }
     const renderItem = ({ item }) => (
        <TodoCard
          task={item}
          onDelete={() => onDelete(item.id)}
          fetchData={fetchData}
        />
      );
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
      <View style={{flexDirection:'row',justifyContent:'flex-end',height:70}}>
        <SortOptions selectedOption={sortBy} onSelect={handleSortBy}/>
      </View>
      {data && data.length > 0 ?(<FlatList
        data={data}
        renderItem={renderItem}
        style={{marginVertical:60}}
        keyExtractor={item => item.id}
        refreshing={refreshing}
        onRefresh={fetchData}
      />):
      (
         refreshing?(<Loader visible={refreshing}/>) :(
      <View style={{flex:1, alignItems: 'center', marginTop: 300 }}>
        <Text style={{fontSize:30}}>No Tasks for Today</Text>
      </View>)
      )
      }
      <View style={styles.addContainer}>
  
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={()=>navigation.navigate('AddTask')}
        >
        <Ionicons name="add" size={30} color="white" />
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
      backgroundColor: '#9395d3', 
      width: 60,
      height: 60,
      borderRadius: 30, 
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5, 
      shadowColor: '#000', 
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