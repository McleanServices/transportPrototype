import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import airportTaxiRotationService from '../services/airportTaxiRotationService';

interface EditAirportTaxiRotationModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  formData: any;
  onFormSubmit: (formData: any) => void;
}

const EditAirportTaxiRotationModal: React.FC<EditAirportTaxiRotationModalProps> = ({ modalVisible, setModalVisible, formData, onFormSubmit }) => {
  const [editData, setEditData] = useState(formData);

  useEffect(() => {
    const preloadData = async () => {
      if (formData.airport_taxi_id) {
        const data = await airportTaxiRotationService.getAirportTaxiRotationById(formData.airport_taxi_id);
        if (data) {
          setEditData({
            ...formData,
            exploitants: data.numero_exploitants,
            destination: data.destination,
            passengerCount: data.passenger_count,
            observations: data.observations,
            date: new Date(data.date),
            airline_name: '1'
          });
        }
      }
    };

    preloadData();
  }, [formData]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleInputChange = (name: string, value: any) => {
    setEditData({ ...editData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const { airport_taxi_id } = editData;
      if (!airport_taxi_id) {
        console.error('No ID provided for update');
        return;
      }

      const dataToUpdate = {
        numero_exploitants: editData.exploitants,
        order_number: formData.order_number,
        taxi_id: formData.taxi_id,
        airline_id: formData.airline_id,
        destination: editData.destination,
        passenger_count: editData.passengerCount,
        observations: editData.observations,
        date: new Date(editData.date).toISOString().split('T')[0],
        airline_name: '1'
      };

      const success = await airportTaxiRotationService.updateAirportTaxiRotation(airport_taxi_id, dataToUpdate);
      
      if (success) {
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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date: Date) => {
    handleInputChange('date', date);
    hideDatePicker();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
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
                  <Text style={styles.label}>DESTINATION</Text>
                  <TextInput
                    style={styles.input}
                    value={editData.destination}
                    onChangeText={(text) => handleInputChange('destination', text)}
                  />
                </View>
              </View>
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>DATE</Text>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={showDatePicker}
                  >
                    <Text>{new Date(editData.date).toLocaleDateString()}</Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={hideDatePicker}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>N PASSAGERS</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="N PASSAGERS"
                    value={editData.passengerCount}
                    onChangeText={(value) => handleInputChange('passengerCount', value)}
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
              <Button title="Submit" onPress={handleSubmit} />
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
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

export default EditAirportTaxiRotationModal;
