import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import firestore from '@react-native-firebase/firestore'

const TodoCard = ({task,onDelete,fetchData}) => {
  const [currentStatus,setCurrentStatus]=useState(task.status)
    const confirmDelete = (taskId) => {
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
      try {
        await firestore()
          .collection('tasks')
          .doc(task.id)
          .update({
            status: currentStatus == 'COMPLETED' ?"INCOMPLETE":"COMPLETED", 
          });
          currentStatus == 'COMPLETED' ?setCurrentStatus("INCOMPLETE"):setCurrentStatus("COMPLETED"), 
        console.log('Task status updated!');
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
    return (
        <View style={styles.card}>
        <View style={{ flex: 1,flexDirection:'row',justifyContent:'space-around' }}>
          <Text style={[styles.title,{ textDecorationLine:currentStatus==="COMPLETED"?"line-through":"none"}]}>{task.title}</Text>
          <View style={{ flex: 1,flexDirection:'row',justifyContent:'flex-end' }}>
            
             <Text style={styles.reminderText}>
             {task.reminderTime
             ? task.reminderTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }):('Pick Time')}
              </Text>

            <TouchableOpacity onPress={confirmDelete}>
            <EvilIcons name="trash" color="#9395d3" size={28} style={styles.icon}/>
            </TouchableOpacity>
        
            <TouchableOpacity onPress={updateTaskStatus}>
            <AntDesign name= {currentStatus === 'COMPLETED' ? "checkcircle":"checkcircleo"} color="#9395d3" size={24} style={styles.icon}/>
            </TouchableOpacity>

          </View>
        </View>
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
      delete: { 
        color: '#9395d3' 
      },
      icon:{
        marginHorizontal:7
      },
      reminderText: {
        fontSize: 16,
        color: '#9395d3',
      },
    });