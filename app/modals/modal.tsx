import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

interface ModalFormProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onFormSubmit: (formData: any) => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ modalVisible, setModalVisible, onFormSubmit }) => {
  const db = useSQLiteContext();
  const [formData, setFormData] = useState({
    exploitants: '',
    arrivalTime: new Date(),
    departureTime: new Date(),
    passengers: '',
    observations: '',
  });

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isArrivalTimePickerVisible, setArrivalTimePickerVisibility] = useState(false);
  const [isDepartureTimePickerVisible, setDepartureTimePickerVisibility] = useState(false);
  const exploitantsOptions = ['111', '123', '138', '145', '159'];

  const handleInputChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS Transport_rotation_fiche (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exploitants TEXT,
            arrivalTime TEXT,
            departureTime TEXT,
            passengers TEXT,
            observations TEXT
          );
        `);
      } catch (error) {
        console.error('Error creating table', error);
        alert('An error occurred while creating the table. Please try again.');
        return;
      }

      const { exploitants, arrivalTime, departureTime, passengers, observations } = formData;
      try {
        console.log('Inserting data:', {
          exploitants,
          arrivalTime: arrivalTime.toISOString(),
          departureTime: departureTime.toISOString(),
          passengers,
          observations
        });
        await db.runAsync(
          'INSERT INTO Transport_rotation_fiche (exploitants, arrivalTime, departureTime, passengers, observations) VALUES (?, ?, ?, ?, ?)',
          [exploitants, arrivalTime.toISOString(), departureTime.toISOString(), passengers, observations]
        );
      } catch (error) {
        console.error('Error inserting data', error);
        alert('An error occurred while inserting data. Please try again.');
        return;
      }

      console.log('Data saved successfully');
      console.log('Saved Data:', formData); // Log the data
      onFormSubmit(formData);

      // Log all data in the table
      try {
        const allData = await db.getAllAsync('SELECT * FROM Transport_rotation_fiche');
        console.log('All Data in Transport_rotation_fiche:', allData);
      } catch (error) {
        console.error('Error fetching all data', error);
      }
    } catch (error) {
      console.error('Error saving data', error);
      alert('An error occurred while saving data. Please try again.');
    }
    setModalVisible(false);
  };

  const showArrivalTimePicker = () => {
    setArrivalTimePickerVisibility(true);
  };

  const hideArrivalTimePicker = () => {
    setArrivalTimePickerVisibility(false);
  };

  const handleArrivalTimeConfirm = (date: Date) => {
    handleInputChange('arrivalTime', date);
    hideArrivalTimePicker();
  };

  const showDepartureTimePicker = () => {
    setDepartureTimePickerVisibility(true);
  };

  const hideDepartureTimePicker = () => {
    setDepartureTimePickerVisibility(false);
  };

  const handleDepartureTimeConfirm = (date: Date) => {
    handleInputChange('departureTime', date);
    hideDepartureTimePicker();
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Modal Form</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>N EXPLOITANTS</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setDropdownVisible(!dropdownVisible)}
                >
                  <Text>{formData.exploitants || 'Select an option'}</Text>
                </TouchableOpacity>
                {dropdownVisible && (
                  <View style={styles.dropdownList}>
                    {exploitantsOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.dropdownItem}
                        onPress={() => {
                          handleInputChange('exploitants', option);
                          setDropdownVisible(false);
                        }}
                      >
                        <Text>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>HEURE D'ARRIVEE</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={showArrivalTimePicker}
                >
                  <Text>{formData.arrivalTime.toLocaleTimeString()}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isArrivalTimePickerVisible}
                  mode="time"
                  onConfirm={handleArrivalTimeConfirm}
                  onCancel={hideArrivalTimePicker}
                />
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>HEURE DE DEPART</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={showDepartureTimePicker}
                >
                  <Text>{formData.departureTime.toLocaleTimeString()}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDepartureTimePickerVisible}
                  mode="time"
                  onConfirm={handleDepartureTimeConfirm}
                  onCancel={hideDepartureTimePicker}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>N PASSAGERS</Text>
                <TextInput
                  style={styles.input}
                  placeholder="N PASSAGERS"
                  value={formData.passengers}
                  onChangeText={(value) => handleInputChange('passengers', value)}
                />
              </View>
            </View>
            <Text style={[styles.label, { marginTop: 15 }]}>OBSERVATIONS/REMARQUES</Text>
            <TextInput
              style={styles.input}
              placeholder="OBSERVATIONS/REMARQUES"
              value={formData.observations}
              onChangeText={(value) => handleInputChange('observations', value)}
            />
            <Button title="Submit" onPress={handleSubmit} />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Adjust the width to make the modal smaller
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  dropdownList: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    zIndex: 1,
  },
  dropdownItem: {
    padding: 10,
  },
});

export default ModalForm;
