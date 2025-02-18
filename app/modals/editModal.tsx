import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useSQLiteContext } from 'expo-sqlite';

interface EditModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  formData: any;
  onFormSubmit: (formData: any) => void;
}

const EditModal: React.FC<EditModalProps> = ({ modalVisible, setModalVisible, formData, onFormSubmit }) => {
  const db = useSQLiteContext();
  const [editData, setEditData] = useState(formData);

  useEffect(() => {
    setEditData(formData);
  }, [formData]);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isArrivalTimePickerVisible, setArrivalTimePickerVisibility] = useState(false);
  const [isDepartureTimePickerVisible, setDepartureTimePickerVisibility] = useState(false);
  const exploitantsOptions = ['111', '123', '138', '145', '159'];

  const handleInputChange = (name: string, value: any) => {
    setEditData({ ...editData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const { id, exploitants, arrivalTime, departureTime, passengers, observations } = editData;
      const arrivalTimeISO = new Date(arrivalTime).toISOString();
      const departureTimeISO = new Date(departureTime).toISOString();
      try {
        await db.runAsync(
          'UPDATE Transport_rotation_fiche SET exploitants = ?, arrivalTime = ?, departureTime = ?, passengers = ?, observations = ? WHERE id = ?',
          [exploitants, arrivalTimeISO, departureTimeISO, passengers, observations, id]
        );
      } catch (error) {
        console.error('Error updating data', error);
        alert('An error occurred while updating data. Please try again.');
        return;
      }

      console.log('Data updated successfully');
      onFormSubmit(editData);

      try {
        const allData = await db.getAllAsync('SELECT * FROM Transport_rotation_fiche');
        console.log('All Data in Transport_rotation_fiche:', allData);
      } catch (error) {
        console.error('Error fetching all data', error);
      }
    } catch (error) {
      console.error('Error updating data', error);
      alert('An error occurred while updating data. Please try again.');
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

export default EditModal;
