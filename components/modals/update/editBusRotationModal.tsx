import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import busRotationService from '../../../app/model/busRotationService';
import { router } from 'expo-router';
interface EditBusRotationModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  formData: any;
  onFormSubmit: (formData: any) => void;
}

const EditBusRotationModal: React.FC<EditBusRotationModalProps> = ({ modalVisible, setModalVisible, formData, onFormSubmit }) => {
  const [editData, setEditData] = useState(formData);

  useEffect(() => {
    const preloadData = async () => {
      if (formData.bus_rotation_id) {
        const data = await busRotationService.getBusRotationById(formData.bus_rotation_id);
        if (data) {
          setEditData({
            ...formData,
            exploitants: data.exploitants,
            arrivalTime: new Date(data.arrival_time),
            departureTime: data.departure_time ? new Date(data.departure_time) : new Date(),
            passengers: String(data.passenger_count), // Convert to string for TextInput
            observations: data.observations
          });
        }
      }
    };

    preloadData();
  }, [formData]);

  const [isArrivalTimePickerVisible, setArrivalTimePickerVisibility] = useState(false);
  const [isDepartureTimePickerVisible, setDepartureTimePickerVisibility] = useState(false);

  const handleInputChange = (name: string, value: any) => {
    setEditData({ ...editData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const { bus_rotation_id } = editData;
      if (!bus_rotation_id) {
        console.error('No ID provided for update');
        return;
      }

      const arrivalTime = new Date(editData.arrivalTime);
      const departureTime = editData.departureTime ? new Date(editData.departureTime) : null;

      if (isNaN(arrivalTime.getTime()) || (departureTime && isNaN(departureTime.getTime()))) {
        alert('Invalid date values. Please check the arrival and departure times.');
        return;
      }

      const dataToUpdate = {
        ...editData,
        arrival_time: arrivalTime.toISOString(),
        departure_time: departureTime ? departureTime.toISOString() : null,
        passenger_count: Number(editData.passengers), // Convert to number
        exploitants: editData.exploitants // Ensure exploitants is correctly set
      };

      console.log('Data to update:', dataToUpdate); // Log the data being sent for insertion

      const response = await busRotationService.updateBusRotation(bus_rotation_id, dataToUpdate);
      
      if (response === true) {
        console.log('Data updated successfully');
        onFormSubmit(dataToUpdate);
        setModalVisible(false);
      } else {
        alert('Failed to update record');
      }
    } catch (error) {
      console.error('Error updating data', error);
      alert('An error occurred while updating data. Please try again.');
    }
  };

  const showArrivalTimePicker = () => {
    setArrivalTimePickerVisibility(true);
  };

  const hideArrivalTimePicker = () => {
    setArrivalTimePickerVisibility(false);
  };

  const handleArrivalTimeConfirm = (date: Date) => {
    if (!isNaN(date.getTime())) {
      handleInputChange('arrivalTime', date);
    } else {
      alert('Invalid arrival time selected.');
    }
    hideArrivalTimePicker();
  };

  const showDepartureTimePicker = () => {
    setDepartureTimePickerVisibility(true);
  };

  const hideDepartureTimePicker = () => {
    setDepartureTimePickerVisibility(false);
  };

  const handleDepartureTimeConfirm = (date: Date) => {
    if (!isNaN(date.getTime())) {
      handleInputChange('departureTime', date);
    } else {
      alert('Invalid departure time selected.');
    }
    hideDepartureTimePicker();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}></Text>
                  <View style={styles.inputRow}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>N EXPLOITANTS</Text>
                      <TextInput
                        style={styles.input}
                        value={editData.exploitants}
                        onChangeText={(text) => handleInputChange('exploitants', text)}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>HEURE D'ARRIVEE</Text>
                      <TouchableOpacity
                        style={styles.input}
                        onPress={showArrivalTimePicker}
                      >
                        <Text>{new Date(editData.arrivalTime).toLocaleTimeString()}</Text>
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
                        <Text>{new Date(editData.departureTime).toLocaleTimeString()}</Text>
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
                        value={editData.passengers}
                        onChangeText={(value) => handleInputChange('passengers', value)}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  <Text style={[styles.label, { marginTop: 15 }]}>OBSERVATIONS/REMARQUES</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="OBSERVATIONS/REMARQUES"
                    value={editData.observations}
                    onChangeText={(value) => handleInputChange('observations', value)}
                  />
                  <View style={styles.buttonContainer}>
                    <Button title="Submit" onPress={handleSubmit} />
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                    <Button title="Add photos" onPress={() => {
                      setModalVisible(false);
                      router.push(`../camera?transport_fiche_id=${editData.bus_rotation_id}`);
                    }
                    } />
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
});

export default EditBusRotationModal;
