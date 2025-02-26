import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { AntDesign, FontAwesome } from '@expo/vector-icons'; 
import { SQLiteProvider } from 'expo-sqlite'; // Ensure this import is correct
import airportTaxiRotationService from '../model/airportTaxiRotationService';

import AirportTaxiRotationModal from '../../components/modals/airportTaxiRotationModal';
import EditAirportTaxiRotationModal from '../../components/modals/editAirportTaxiRotationModal';
import AirportTaxiViewModal from '../../components/modals/airportTaxiViewModal';

export interface AirportTaxiRotationFormData {
  airport_taxi_id?: number;
  numero_exploitants: string;
  order_number: number;
  taxi_id: number;
  airline_id: number;
  destination: string;
  passenger_count: number;
  observations: string | null;
  date: string;
  created_at?: string;
  airline_name: string;
}

export default function AirportTaxiRotationFiche() {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<AirportTaxiRotationFormData[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const records = await airportTaxiRotationService.getAllAirportTaxiRotations();
      setData(records);
    } catch (error) {
      console.error('Error fetching data from database', error);
      setData([]);
    }
  };

  const refreshData = async () => {
    await fetchData();
  };

  const handleFormSubmit = async (newFormData: AirportTaxiRotationFormData) => {
    try {
      const newId = await airportTaxiRotationService.createAirportTaxiRotation(newFormData);
      if (newId) {
        await refreshData(); // Refresh data after successful insertion
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating new record', error);
      throw error;
    }
  };

  const handleEditFormSubmit = async (updatedFormData: AirportTaxiRotationFormData) => {
    if (selectedRow === null) return;

    try {
      const airport_taxi_id = data[selectedRow]?.airport_taxi_id;
      if (airport_taxi_id !== undefined) {
        const success = await airportTaxiRotationService.updateAirportTaxiRotation(airport_taxi_id, updatedFormData);
        if (success) {
          await fetchData();
          setEditModalVisible(false);
        } else {
          console.error('Failed to update record');
        }
      }
    } catch (error) {
      console.error('Error updating record', error);
    }
  };

  const handleRowSelect = (index: number) => {
    setSelectedRow((prevSelectedRow) => (prevSelectedRow === index ? null : index));
  };

  const handleEditPress = () => {
    setEditModalVisible(true);
  };

  const handleViewPress = (index: number) => {
    setSelectedRow(index);
    setViewModalVisible(true);
  };

  useEffect(() => {
    const initAndFetch = async () => {
      try {
        await airportTaxiRotationService.initDatabase();
        await fetchData();
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };
    
    initAndFetch();
  }, []);

  return (
    <SQLiteProvider databaseName="transport.db">
      <View style={{ flex: 1 }}>
        <Text style={styles.headerTitle}>
          <Text style={styles.blueText}>AIRPORT TAXI ROTATIONS</Text> <Text style={styles.redText}>DAILY ROTATIONS</Text>
        </Text>
        <FlatList
          ListHeaderComponent={
            <View
              style={{
                flexDirection: "row",
                borderWidth: 1,
                borderColor: "#000",
              }}
            >
              <FontAwesome name="pencil" size={20} style={{ flex: 0.3, textAlign: "center" }} /> 
              <View style={{ width: 1, backgroundColor: "#000" }} />
              <Text style={{ flex: 0.5, textAlign: "center" }}>ORDER NUMBER</Text> 
              <View style={{ width: 1, backgroundColor: "#000" }} />
              <Text style={{ flex: 1, textAlign: "center" }}>EXPLOITANTS</Text>
              <View style={{ width: 1, backgroundColor: "#000" }} />
              <Text style={{ flex: 1, textAlign: "center" }}>AIRLINE COMPANY</Text>
              <View style={{ width: 1, backgroundColor: "#000" }} />
              <Text style={{ flex: 1, textAlign: "center" }}>DESTINATION</Text>
              <View style={{ width: 1, backgroundColor: "#000" }} />
              <Text style={{ flex: 1, textAlign: "center" }}>PASSENGER COUNT</Text>
              <View style={{ width: 1, backgroundColor: "#000" }} />
              <Text style={{ flex: 1, textAlign: "center" }}>OBSERVATIONS</Text>
            </View>
          }
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={[styles.row, { backgroundColor: index % 2 === 0 ? 'lightblue' : 'white' }]}>
              <TouchableOpacity style={[styles.cell, { flex: 0.3 }]} onPress={() => handleRowSelect(index)}>
                <Text>{selectedRow === index ? '✓' : ''}</Text>
              </TouchableOpacity>
              <Text style={[styles.cell, { flex: 0.5 }]}>{index + 1}</Text> 
              <Text style={styles.cell}>{item.numero_exploitants}</Text>
              <Text style={styles.cell}>{item.airline_name}</Text>
              <Text style={styles.cell}>{item.destination}</Text>
              <Text style={styles.cell}>{item.passenger_count}</Text>
              <TouchableOpacity style={[styles.cell, styles.centeredCell]} onPress={() => handleViewPress(index)}>
                <Text>View</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{
            flexGrow: 1,
            padding: 20,
          }}
        />
        {selectedRow !== null && (
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <AntDesign name="edit" size={24} color="white" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
        <AirportTaxiRotationModal 
          modalVisible={modalVisible} 
          setModalVisible={setModalVisible} 
          onFormSubmit={handleFormSubmit} // Use the new handler
        />
        {selectedRow !== null && (
          <EditAirportTaxiRotationModal
            modalVisible={editModalVisible}
            setModalVisible={setEditModalVisible}
            formData={data[selectedRow]}
            onFormSubmit={handleEditFormSubmit}
          />
        )}
        {selectedRow !== null && data[selectedRow]?.airport_taxi_id !== undefined && (
          <AirportTaxiViewModal
            airport_taxi_id={data[selectedRow].airport_taxi_id!}
            modalVisible={viewModalVisible}
            setModalVisible={setViewModalVisible}
            formData={data[selectedRow]}
          />
        )}
      </View>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 90, // Adjusted to be above the plus add button
    right: 20,  // Align with the plus add button
    backgroundColor: '#FFA500',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  publishButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  publishButtonText: {
    color: 'white',
    marginLeft: 10,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    backgroundColor: '#dc3545',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    marginLeft: 10,
  },
  centeredCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  blueText: {
    color: 'blue',
  },
  redText: {
    color: 'red',
  },
});
