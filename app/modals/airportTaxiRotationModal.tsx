import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Button, StyleSheet, TextInput } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import airportTaxiRotationService from '../services/airportTaxiRotationService';

interface AirportTaxiRotationModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onFormSubmit: (formData: any) => void;
}

const AirportTaxiRotationModal: React.FC<AirportTaxiRotationModalProps> = ({ modalVisible, setModalVisible, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    exploitants: '',
    destination: '',
    passengerCount: 0,
    observations: '',
    date: new Date(),
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [errors, setErrors] = useState({
    exploitants: '',
    destination: '',
    date: '',
  });

  const validateForm = () => {
    let valid = true;
    let newErrors = { exploitants: '', destination: '', date: '' };

    if (!formData.exploitants) {
      newErrors.exploitants = 'Exploitants is required';
      valid = false;
    }
    if (!formData.destination) {
      newErrors.destination = 'Destination is required';
      valid = false;
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const dataToSubmit = {
        numero_exploitants: formData.exploitants,
        order_number: 1, // Default value, update as needed
        taxi_id: 1, // Default value, update as needed
        airline_id: 1, // Default value, update as needed
        destination: formData.destination,
        passenger_count: formData.passengerCount,
        observations: formData.observations ?? null,
        date: formData.date.toISOString().split('T')[0], // Current date
        airline_name: '1',
      };

      await onFormSubmit(dataToSubmit);
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving data', error);
      alert('An error occurred while saving data. Please try again.');
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

  const isFormValid = () => {
    return formData.exploitants && formData.destination && formData.date;
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
            <Text style={styles.modalText}></Text>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>N EXPLOITANTS</Text>
                <TextInput
                  style={styles.input}
                  value={formData.exploitants}
                  onChangeText={(text) => handleInputChange('exploitants', text)}
                />
                {errors.exploitants ? <Text style={styles.errorText}>{errors.exploitants}</Text> : null}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>DESTINATION</Text>
                <TextInput
                  style={styles.input}
                  value={formData.destination}
                  onChangeText={(text) => handleInputChange('destination', text)}
                />
                {errors.destination ? <Text style={styles.errorText}>{errors.destination}</Text> : null}
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>DATE</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={showDatePicker}
                >
                  <Text>{formData.date.toLocaleDateString()}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleDateConfirm}
                  onCancel={hideDatePicker}
                />
                {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}
              </View>
            </View>
            <Button title="Submit" onPress={handleSubmit} disabled={!isFormValid()} />
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
    width: '80%',
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});

export default AirportTaxiRotationModal;
