import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SortOptions = ({ selectedOption, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sort By</Text>

      <TouchableOpacity
        style={styles.option}
        onPress={() => onSelect('createdAt')}
      >
        <View style={styles.radioCircle}>
          {selectedOption === 'createdAt' && <View style={styles.selectedRb} />}
        </View>
        <Text style={styles.optionText}>Created Time</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => onSelect('reminderTime')}
      >
        <View style={styles.radioCircle}>
          {selectedOption === 'reminderTime' && <View style={styles.selectedRb} />}
        </View>
        <Text style={styles.optionText}>Reminder Time</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SortOptions;

const styles = StyleSheet.create({
  container: {
    height:100,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 5,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    color:'black'
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  radioCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#9395d3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#9395d3',
  },
});
