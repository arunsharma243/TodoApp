import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import notifee, {  TriggerType } from '@notifee/react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


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

  const handleSaveTask = async () => {
    const uid = await AsyncStorage.getItem("USERID");
    console.log("1")
    if(!title){
      Alert.alert("Title can't be empty")
      return
    }
     await firestore().collection('tasks').add({
      uid: uid,
      title: title,
      status: 'INCOMPLETE',
      createdAt: firestore.FieldValue.serverTimestamp(),
      reminderTime: reminder,
    });
    console.log("2")
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
    await scheduleReminder(title, reminder);
    
  };

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
