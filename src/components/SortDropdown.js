import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const SortDropdown = ({ selectedOption, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const options = [
    { label: 'Created Time', value: 'createdAt' },
    { label: 'Reminder Time', value: 'reminderTime' },
  ];

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text>{options.find(opt => opt.value === selectedOption)?.label || 'Sort By'}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.option}
                onPress={() => {
                  onSelect(option.value);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.option, { backgroundColor: '#eee' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: 'red', textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SortDropdown;

const styles = StyleSheet.create({
  dropdownContainer: {
    margin: 16,
  },
  dropdownButton: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    margin: 32,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  optionText: {
    fontSize: 16,
  },
});
