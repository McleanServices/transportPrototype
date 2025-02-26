import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import busRotationService, { BusRotationData } from '../../app/model/busRotationService';

// Rename FormData to TransportFormData to avoid conflict
interface ViewModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  data: BusRotationData[];
}

const ViewModal: React.FC<ViewModalProps> = ({ modalVisible, setModalVisible, data }) => {
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
            <Text style={styles.modalText}>Rotations Summary</Text>
            
            <ScrollView style={styles.scrollView}>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <View key={index} style={styles.dataRow}>
                    <Text style={styles.dataHeader}>Record #{index + 1}</Text>
                    <View style={styles.dataItem}>
                      <Text style={styles.label}>N EXPLOITANTS:</Text>
                      <Text style={styles.value}>{item.numero_exploitants}</Text>
                    </View>
                    <View style={styles.dataItem}>
                      <Text style={styles.label}>HEURE D'ARRIVEE:</Text>
                      <Text style={styles.value}>{new Date(item.arrival_time).toLocaleTimeString()}</Text>
                    </View>
                    <View style={styles.dataItem}>
                      <Text style={styles.label}>HEURE DE DEPART:</Text>
                      <Text style={styles.value}>{item.departure_time ? new Date(item.departure_time).toLocaleTimeString() : 'N/A'}</Text>
                    </View>
                    <View style={styles.dataItem}>
                      <Text style={styles.label}>N PASSAGERS:</Text>
                      <Text style={styles.value}>{item.passenger_count}</Text>
                    </View>
                    <View style={styles.dataItem}>
                      <Text style={styles.label}>OBSERVATIONS:</Text>
                      <Text style={styles.value}>{item.observations || 'N/A'}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>No data available</Text>
              )}
            </ScrollView>
            
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
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
    maxHeight: '80%',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    width: '100%',
    marginVertical: 10,
  },
  dataRow: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  dataHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  dataItem: {
    flexDirection: 'row',
    paddingVertical: 3,
  },
  label: {
    flex: 1,
    fontWeight: '500',
  },
  value: {
    flex: 1,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    width: '50%',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default ViewModal;
