import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, StyleSheet, TextInput, Image } from 'react-native';
import { router } from 'expo-router';
import busRotationService from '../services/busRotationService';

// Rename FormData to TransportFormData to avoid conflict
interface ViewModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  formData: {
    id?: number;
    exploitants: string;
    arrivalTime: string;
    departureTime: string | null;
    passengers: string | null;
    observations: string | null;
    order?: number;
  };
  transport_fiche_id: number;
}

const ViewModal: React.FC<ViewModalProps> = ({ modalVisible, setModalVisible, formData, transport_fiche_id }) => {
  const [editData, setEditData] = useState(formData);


  // Fetch latest data when modal opens
  useEffect(() => {
    const fetchRecord = async () => {
      if (modalVisible && transport_fiche_id) {
        try {
          const record = await busRotationService.getBusRotationById(transport_fiche_id);
        } catch (error) {
          console.error('Error fetching record:', error);
        }
      }
    };

    fetchRecord();
  }, [modalVisible, transport_fiche_id]);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>N* D'ORDRE: {transport_fiche_id} N EXPLOITANTS: {editData.exploitants}</Text>
          <Button title="Add Photos" onPress={() => {
            setModalVisible(false);
            router.push(`./(app)/modals/camera?transport_fiche_id=${transport_fiche_id}`);
          }} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
  },
});

export default ViewModal;
