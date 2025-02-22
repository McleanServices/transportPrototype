import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const stationsList = ["Marigot", "Grand Case"];

interface StationModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  selectedStation: string;
  setSelectedStation: (station: string) => void;
}

const StationModal: React.FC<StationModalProps> = ({ modalVisible, setModalVisible, selectedStation, setSelectedStation }) => {
  return (
    <Modal visible={modalVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Station</Text>
          <ScrollView>
            {stationsList.map((station, index) => (
              <TouchableOpacity
                key={index}
                style={styles.stationItem}
                onPress={() => {
                  setSelectedStation(station);
                  setModalVisible(false);
                }}
              >
                <Text style={selectedStation === station ? styles.selectedStation : styles.stationText}>
                  {station}
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
  stationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  stationText: {
    fontSize: 16,
  },
  selectedStation: {
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

export default StationModal;
