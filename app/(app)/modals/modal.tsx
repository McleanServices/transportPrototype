import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Button, StyleSheet, TextInput } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useSQLiteContext } from 'expo-sqlite';

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
    departureTime: null, // Set departureTime to null
    passengers: null, // Set passengers to null
    observations: null, // Set observations to null
  });

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isArrivalTimePickerVisible, setArrivalTimePickerVisibility] = useState(false);
  const exploitantsOptions = ['111', '123', '138', '145', '159'];

  const [errors, setErrors] = useState({
    exploitants: '',
    arrivalTime: '',
  });

  const validateForm = () => {
    let valid = true;
    let newErrors = { exploitants: '', arrivalTime: '' };

    if (!formData.exploitants) {
      newErrors.exploitants = 'Exploitants is required';
      valid = false;
    }
    if (!formData.arrivalTime) {
      newErrors.arrivalTime = 'Arrival time is required';
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

      const { exploitants, arrivalTime } = formData;
      try {
        console.log('Inserting data:', {
          exploitants,
          arrivalTime: arrivalTime.toISOString(),
          departureTime: null, // Set departureTime to null
          passengers: null, // Set passengers to null
          observations: null // Set observations to null
        });
        await db.runAsync(
          'INSERT INTO Transport_rotation_fiche (exploitants, arrivalTime, departureTime, passengers, observations) VALUES (?, ?, ?, ?, ?)',
          [exploitants, arrivalTime.toISOString(), null, null, null]
        );
      } catch (error) {
        console.error('Error inserting data', error);
        alert('An error occurred while inserting data. Please try again.');
        return;
      }

      console.log('Data saved successfully');
      console.log('Saved Data:', formData); // Log the data
      onFormSubmit(formData);

      try {
        const allData: any = await db.getAllAsync('SELECT * FROM Transport_rotation_fiche');
        console.log('All Data in Transport_rotation_fiche:', allData);

        if (Array.isArray(allData)) {
          console.log('allData is an array with length:', allData.length);
          if (allData.length > 0) {
            console.log('First element of allData:', allData[0]);
            // alert('Data fetched successfully');
          } else {
            console.error('allData array is empty');
            alert('No data found.');
          }
        } else {
          console.error('allData is not an array');
          alert('No data found.');
        }
      } catch (error) {
        console.error('Error fetching all data', error);
        alert('An error occurred while fetching data. Please try again.');
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

  const isFormValid = () => {
    return formData.exploitants && formData.arrivalTime;
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
                {errors.arrivalTime ? <Text style={styles.errorText}>{errors.arrivalTime}</Text> : null}
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});

export default ModalForm;
