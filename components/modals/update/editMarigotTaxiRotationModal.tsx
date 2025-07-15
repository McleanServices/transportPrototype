import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import marigotTaxiRotationService from '../../../app/(app)/model/marigotTaxiRotationService';

interface EditMarigotTaxiRotationModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  formData: any;
  onFormSubmit: (formData: any) => void;
}

const EditMarigotTaxiRotationModal: React.FC<EditMarigotTaxiRotationModalProps> = ({ modalVisible, setModalVisible, formData, onFormSubmit }) => {
  const [editData, setEditData] = useState(formData);

  useEffect(() => {
    const preloadData = async () => {
      if (formData.marigot_taxi_id) {
        const data = await marigotTaxiRotationService.getMarigotTaxiRotationById(formData.marigot_taxi_id);
        if (data) {
          setEditData({
            ...formData,
            boat_name: data.boat_name,
            other_transport: data.other_transport,
            destination: data.destination,
            passenger_count: data.passenger_count,
            observations: data.observations,
            date: new Date(data.date)
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
      const { marigot_taxi_id } = editData;
      if (!marigot_taxi_id) {
        console.error('No ID provided for update');
        return;
      }

      const dataToUpdate = {
        order_number: editData.order_number,
        taxi_id: editData.taxi_id,
        boat_name: editData.boat_name,
        other_transport: editData.other_transport,
        destination: editData.destination,
        passenger_count: editData.passenger_count,
        observations: editData.observations,
        date: new Date(editData.date).toISOString().split('T')[0]
      };

      const success = await marigotTaxiRotationService.updateMarigotTaxiRotation(marigot_taxi_id, dataToUpdate);
      
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
                  <Text style={styles.label}>N° TAXI</Text>
                  <TextInput
                    style={styles.input}
                    value={editData.taxi_id}
                    onChangeText={(text) => handleInputChange('taxi_id', text)}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>BATEAU</Text>
                  <TextInput
                    style={styles.input}
                    value={editData.boat_name}
                    onChangeText={(text) => handleInputChange('boat_name', text)}
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
                  <Text style={styles.label}>N° PASSAGERS</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="N° PASSAGERS"
                    value={editData.passenger_count}
                    onChangeText={(value) => handleInputChange('passenger_count', value)}
                  />
                </View>
              </View>
              <Text style={[styles.label, { marginTop: 15 }]}>OBSERVATIONS</Text>
              <TextInput
                style={styles.input}
                placeholder="OBSERVATIONS"
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

export default EditMarigotTaxiRotationModal;
