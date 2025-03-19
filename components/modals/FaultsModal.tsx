import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const faultsList = [
  'Conducteur non connu du service transport',
  'Excès de passagers',
  'Récupération illégale de clients',
  'Refus de course',
  'Plainte pour abus/insultes',
  'Véhicule en mauvais état / refusé au contrôle technique',
  'Absence d’ATRN valide',
  'Véhicule sale',
  'Chauffeur mal vêtu',
  'Sur-tarification',
  'Refus d’attendre avec le véhicule',
  'État d’ébriété pendant le service',
  'Chauffeur fumant pendant le travail',
  'Refus d’obtempérer aux ordres du contrôleur',
  'Refus de présenter les documents',
  'Absence de formation de capacité professionnelle'
];

interface FaultsModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  selectedFaults: string[];
  setSelectedFaults: (faults: string[]) => void;
}

const FaultsModal: React.FC<FaultsModalProps> = ({ modalVisible, setModalVisible, selectedFaults, setSelectedFaults }) => {
  const toggleFaultSelection = (fault: string) => {
    if (selectedFaults.includes(fault)) {
      setSelectedFaults(selectedFaults.filter(item => item !== fault));
    } else {
      setSelectedFaults([...selectedFaults, fault]);
    }
  };

  return (
    <Modal visible={modalVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Faults</Text>
          <ScrollView>
            {faultsList.map((fault, index) => (
              <TouchableOpacity
                key={index}
                style={styles.faultItem}
                onPress={() => toggleFaultSelection(fault)}
              >
                <Text style={selectedFaults.includes(fault) ? styles.selectedFault : styles.faultText}>
                  {fault}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  faultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  faultText: {
    fontSize: 16,
  },
  selectedFault: {
    fontSize: 16,
    color: 'blue',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FaultsModal;
