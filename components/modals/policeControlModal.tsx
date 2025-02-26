import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Button, StyleSheet, TextInput } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface PoliceControlModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onFormSubmit: (formData: any) => void;
  busRotationId?: number;
}

const PoliceControlModal: React.FC<PoliceControlModalProps> = ({ 
  modalVisible, 
  setModalVisible, 
  onFormSubmit,
  busRotationId 
}) => {
  const [formData, setFormData] = useState({
    officerName: '',
    controlTime: new Date(),
    remarks: '',
    actionTaken: '',
  });

  const [isControlTimePickerVisible, setControlTimePickerVisibility] = useState(false);

  const [errors, setErrors] = useState({
    officerName: '',
    controlTime: '',
  });

  const validateForm = () => {
    let valid = true;
    let newErrors = { officerName: '', controlTime: '' };

    if (!formData.officerName) {
      newErrors.officerName = 'Officer name is required';
      valid = false;
    }
    if (!formData.controlTime) {
      newErrors.controlTime = 'Control time is required';
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
        bus_rotation_id: busRotationId,
        officer_name: formData.officerName,
        control_time: formData.controlTime.toISOString(),
        remarks: formData.remarks,
        action_taken: formData.actionTaken,
      };

      await onFormSubmit(dataToSubmit);
      setModalVisible(false);
      setFormData({
        officerName: '',
        controlTime: new Date(),
        remarks: '',
        actionTaken: '',
      });
    } catch (error) {
      console.error('Error processing form submission:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const showControlTimePicker = () => {
    setControlTimePickerVisibility(true);
  };

  const hideControlTimePicker = () => {
    setControlTimePickerVisibility(false);
  };

  const handleControlTimeConfirm = (date: Date) => {
    handleInputChange('controlTime', date);
    hideControlTimePicker();
  };

  const isFormValid = () => {
    return formData.officerName && formData.controlTime;
  };

  // Helper function to format time properly
  const formatTimeDisplay = (date: Date | null) => {
    if (!date) return '';
    
    try {
      const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return timeString;
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
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
            <Text style={styles.modalText}>Police Control</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>NOM DE L'OFFICIER</Text>
              <TextInput
                style={styles.input}
                value={formData.officerName}
                onChangeText={(text) => handleInputChange('officerName', text)}
              />
              {errors.officerName ? <Text style={styles.errorText}>{errors.officerName}</Text> : null}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>HEURE DU CONTRÔLE</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={showControlTimePicker}
              >
                <Text>{formatTimeDisplay(formData.controlTime)}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isControlTimePickerVisible}
                mode="time"
                onConfirm={handleControlTimeConfirm}
                onCancel={hideControlTimePicker}
              />
              {errors.controlTime ? <Text style={styles.errorText}>{errors.controlTime}</Text> : null}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>REMARQUES</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline={true}
                numberOfLines={4}
                value={formData.remarks}
                onChangeText={(text) => handleInputChange('remarks', text)}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>ACTION PRISE</Text>
              <TextInput
                style={styles.input}
                value={formData.actionTaken}
                onChangeText={(text) => handleInputChange('actionTaken', text)}
              />
            </View>
            
            <View style={styles.buttonContainer}>
              <Button title="Submit" onPress={handleSubmit} disabled={!isFormValid()} />
              <View style={styles.buttonSpacer} />
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
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
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  buttonSpacer: {
    width: 20,
  },
});

export default PoliceControlModal;
