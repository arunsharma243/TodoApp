import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore'

const TodoCard = ({task,onDelete,fetchData}) => {
  const [currentStatus,setCurrentStatus]=useState(task.status)
    // const { title, description, status, reminderTime, createdAt } = task;
    const confirmDelete = (taskId) => {
      // console.log("delete",taskId)
      Alert.alert(
        'Delete Task',
        'Are you sure you want to delete this task?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => onDelete(taskId) },
        ]
      );
    };
    const updateTaskStatus=async()=>{
      // const uid=await AsyncStorage.getItem("USERID")
      console.log("NJD",task.id)
      try {
        await firestore()
          .collection('tasks')
          .doc(task.id)
          .update({
            status: currentStatus == 'COMPLETED' ?"INCOMPLETE":"COMPLETED", 
          });
          // fetchData()
          currentStatus == 'COMPLETED' ?setCurrentStatus("INCOMPLETE"):setCurrentStatus("COMPLETED"), 
        console.log('Task status updated!');
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  // console.log("current",task)
    return (
        <View style={styles.card}>
        <View style={{ flex: 1,flexDirection:'row',justifyContent:'space-around' }}>
          <Text style={[styles.title,{ textDecorationLine:currentStatus==="COMPLETED"?"line-through":"none"}]}>{task.title}</Text>
          {/* <Text style={styles.date}>{task.time}</Text> */}
          <View style={{ flex: 1,flexDirection:'row',justifyContent:'flex-end' }}>
            <TouchableOpacity onPress={confirmDelete}>
            <EvilIcons name="trash" color="#9395d3" size={24} style={styles.icon}/>
            </TouchableOpacity>
        
          <TouchableOpacity onPress={updateTaskStatus}>
          <AntDesign name= {currentStatus === 'COMPLETED' ? "checkcircle":"checkcircleo"} color="#9395d3" size={24} style={styles.icon}/>
          </TouchableOpacity>
         
          {/* <AntDesign name="checkcircle" color="#9395d3" size={24} style={styles.icon}/> */}
          </View>
          
          {/* <Text style={styles.status}>
            Status: {task.status === 'COMPLETED' ? '✅' : '❌'}
          </Text> */}
        </View>
        {/* <View style={styles.actions}> */}
          {/* <TouchableOpacity onPress={onToggleStatus}>
            <Text style={styles.toggle}>Toggle</Text>
          </TouchableOpacity> */}
         
            {/* <Text style={styles.delete}>Long Press to Delete</Text> */}
          {/* <TouchableOpacity onLongPress={onDelete}>
            <Text style={styles.delete}>Delete</Text>
          </TouchableOpacity> */}
        {/* </View> */}
      </View>
  )
}

export default TodoCard

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 30,
        borderRadius: 10,
        elevation: 7,
        flexDirection: 'row',
        alignItems: 'center',
      },
      title: { 
        fontSize: 20, 
        fontWeight: '600', 
        marginBottom: 4 ,
        color:'#9395d3',
        textDecorationStyle:'dashed'
       
      },
      date: { 
        fontSize: 14, 
        color: '#666' 
      },
      status: { 
        fontSize: 14, 
        marginTop: 4 
      },
      actions: { 
        marginLeft: 10 
      },
      toggle: { 
        color: '#007BFF', 
        marginBottom: 5 
      },
      delete: { 
        color: '#9395d3' 
      },
      icon:{
        marginHorizontal:7
      }
    });