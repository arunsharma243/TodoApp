import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import notifee, {  TriggerType } from '@notifee/react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// import PushNotification from 'react-native-push-notification';

const AddTaskScreen = () => {
  const [title, setTitle] = useState('');
  const [reminder, setReminder] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');
  const navigation = useNavigation();

  const onChangeReminderTime = (event, selectedDate) => {
    if (selectedDate) {
      if (pickerMode === 'date') {
        // First picked the date, now pick time
        const currentDate = selectedDate;
        setReminder(currentDate);
        setPickerMode('time'); // Switch to Time picker
        setShowPicker(true);   // Keep picker open
      } else {
        // Now picked the time, combine it
        const pickedTime = selectedDate;
        const updatedReminder = new Date(
          reminder.getFullYear(),
          reminder.getMonth(),
          reminder.getDate(),
          pickedTime.getHours(),
          pickedTime.getMinutes()
        );
        setReminder(updatedReminder);
        setShowPicker(false);  // Close picker
        setPickerMode('date'); // Reset
      }
    } else {
      setShowPicker(false);
      setPickerMode('date');
    }
  };
  // const onChangeReminderTime = (event, selectedTime) => {
  //   if (selectedTime) {
  //     const now = new Date();
  //     const newReminder = new Date(
  //       now.getFullYear(),
  //       now.getMonth(),
  //       now.getDate(),
  //       selectedTime.getHours(),
  //       selectedTime.getMinutes(),
  //       0
  //     );
  //     setReminder(newReminder);
  //   }
  //   setShowPicker(Platform.OS === 'ios');
  // };

  const scheduleReminder = async (taskTitle, fireDate) => {
    const trigger= {
      type: TriggerType.TIMESTAMP,
      timestamp: fireDate.getTime(),
    };

    await notifee.createTriggerNotification(
      {
        title: '⏰ Task Reminder',
        body: taskTitle,
        android: {
          channelId: 'default',
          sound:'default',
          pressAction: {
            id: 'default',
          },
        },
      },
      trigger
    );
  };

  // const onChangeReminderTime = (event, selectedDate) => {
  //   const currentDate = selectedDate || reminder;
  //   setShowPicker(Platform.OS === 'ios');
  //   setReminder(currentDate);
  // };

  // const scheduleReminder = async (taskTitle, fireDate) => {
  //   const trigger= {
  //     type: TriggerType.TIMESTAMP,
  //     timestamp: fireDate.getTime(), // Fire at exact time
  //   };

  //   await notifee.createTriggerNotification(
  //     {
  //       title: 'Task Reminder',
  //       body: taskTitle,
  //       android: {
  //         channelId: 'default',
  //       },
  //     },
  //     trigger
  //   );
  // };

  const handleSaveTask = async () => {
    const uid = await AsyncStorage.getItem("USERID");
    console.log("1")
    if(!title){
      Alert.alert("Title can't be empty")
      return
    }
    // const taskId = firestore().collection('tasks').doc().id;
     await firestore().collection('tasks').add({
      // taskId:taskId,
      uid: uid,
      title: title,
      status: 'INCOMPLETE',
      createdAt: firestore.FieldValue.serverTimestamp(),
      reminderTime: reminder,
    });
    console.log("2")
    // navigation.navigate('Home');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
    await scheduleReminder(title, reminder);
    
  };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Enter Task Title"
//         value={title}
//         onChangeText={setTitle}
//         style={styles.input}
//       />
//       <Button title="Pick Reminder Time" onPress={() => setShowPicker(true)} />
//       {showPicker && (
//         <DateTimePicker
//           value={reminder}
//           mode="time"
//           display="default"
//           onChange={onChangeReminderTime}
//         />
//       )}
//       <Text>Reminder set for: {reminder.toLocaleString()}</Text>
//       <Button title="ADD" onPress={handleSaveTask} />
//     </View>
//   );
// };
return (
  <View style={styles.container}>
    <TextInput
      placeholder="Enter Task Title"
      value={title}
      onChangeText={setTitle}
      style={styles.input}
    />

    <TouchableOpacity style={styles.reminderInput} onPress={() => setShowPicker(true)}>
      <Text style={styles.reminderText}>
        {reminder ? reminder.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Pick Date & Time'}
      </Text>
      <MaterialCommunityIcons name="alarm" color="#9395d3" size={24} style={styles.icon} />
    </TouchableOpacity>

    {showPicker && (
      <DateTimePicker
        value={reminder}
        mode={pickerMode}
        display="default"
        onChange={onChangeReminderTime}
      />
    )}

    <TouchableOpacity style={styles.addButton} onPress={handleSaveTask}>
      <Text style={styles.addButtonText}>ADD</Text>
    </TouchableOpacity>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
    backgroundColor: '#f9f9f9',
  },
  input: {
    borderBottomWidth: 3,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  reminderInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    borderBottomWidth: 3,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
  },
  reminderText: {
    fontSize: 16,
    color: '#555',
  },
  addButton: {
    backgroundColor: '#9395d3',
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});


export default AddTaskScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     gap: 20,
//     justifyContent: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 12,
//   },
// });

  // const scheduleNotification = (title, date) => {
  //   console.log("notification")
  //   // PushNotification.localNotificationSchedule({
  //   //   channelId: "todo-reminders",
  //   //   message: `Reminder: ${title}`,
  //   //   date,
  //   //   allowWhileIdle: true,
  //   // });
  //   console.log("notification End")
  // };

  // const handleAddTask = async () => {
  //   const uid = await AsyncStorage.getItem("USERID");
    
  //   firestore()
  //     .collection('tasks')
  //     .add({
  //       uid: uid,
  //       title: taskTitle,
  //       status: 'INCOMPLETE',
  //       reminderTime: reminderTime,
  //       createdAt: firestore.FieldValue.serverTimestamp(),
  //     })
  //     .then(() => {
  //       navigation.navigate('Home'); // Navigate back to HomeScreen
  //       scheduleNotification(taskTitle, reminderTime);
        
  //     });
  // };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Task Title:</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your task"
//         value={taskTitle}
//         onChangeText={setTaskTitle}
//       />

//       {/* Reminder Time Selection */}
//       <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.reminderButton}>
//         <Text style={styles.reminderText}>Set Reminder: {reminderTime.toLocaleTimeString()}</Text>
//       </TouchableOpacity>

//       {showPicker && (
//         <DateTimePicker
//           value={reminderTime}
//           mode="time"
//           display="default"
//           onChange={(event, selectedDate) => {
//             setShowPicker(false);
//             if (selectedDate) setReminderTime(selectedDate);
//           }}
//         />
//       )}

//       {/* Add Task Button */}
//       <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
//         <Text style={styles.addButtonText}>Add Task</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default AddTaskScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
//   label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     height: 45,
//     marginBottom: 20,
//   },
//   reminderButton: {
//     backgroundColor: '#007BFF',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   reminderText: { color: 'white', fontSize: 16 },
//   addButton: {
//     backgroundColor: '#28A745',
//     padding: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
// });



