import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList, Pressable } from "react-native";
import { AntDesign, FontAwesome } from '@expo/vector-icons'; 
import { SQLiteProvider } from 'expo-sqlite';
import { useRouter } from 'expo-router';
import { AirportTaxiRotationData } from '../model/airportTaxiRotationService';
import * as airportTaxiRotationController from '../controller/airportTaxiRotationController';

import AirportTaxiRotationModal from '../../components/modals/airportTaxiRotationModal';
import EditAirportTaxiRotationModal from '../../components/modals/editAirportTaxiRotationModal';
import AirportTaxiViewModal from '../../components/modals/airportTaxiViewModal';

export default function AirportTaxiRotationFiche() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<AirportTaxiRotationData[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const records = await airportTaxiRotationController.fetchAllAirportTaxiRotations();
      setData(records);
    } catch (error) {
      console.error('Error fetching data from database', error);
      setError('Failed to load data. Please try again.');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePoliceControlAction = () => {
    if (selectedRow !== null) {
      const airport_taxi_rotation_id = data[selectedRow].airport_taxi_id;
      const additionalVariable = "air_taxi"; // Replace with your actual string variable
      if (airport_taxi_rotation_id !== undefined) {
        // Navigate to the police control screen with the airport_taxi_rotation_id and additionalVariable
        console.log('id is', airport_taxi_rotation_id);
        router.push(`/fiche/control?airport_taxi_rotation_id=${airport_taxi_rotation_id}&type=${additionalVariable}`);
      } else {
        alert("Please select a bus rotation first");
      }
    } else {
      alert("Please select a bus rotation first");
    }
  };

  const handleFormSubmit = async (newFormData: AirportTaxiRotationData) => {
    try {
      const newId = await airportTaxiRotationController.createAirportTaxiRotation(newFormData);
      if (newId > 0) {
        await fetchData(); // Refresh data after successful insertion
        setModalVisible(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating new record', error);
      throw error;
    }
  };

  const handleEditFormSubmit = async (updatedFormData: AirportTaxiRotationData) => {
    if (selectedRow === null) return;

    try {
      const airport_taxi_id = data[selectedRow]?.airport_taxi_id;
      if (airport_taxi_id !== undefined) {
        const success = await airportTaxiRotationController.updateAirportTaxiRotation(airport_taxi_id, updatedFormData);
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

  const handleDelete = async () => {
    if (selectedRow === null) return;

    try {
      const airport_taxi_id = data[selectedRow]?.airport_taxi_id;
      if (airport_taxi_id !== undefined) {
        const success = await airportTaxiRotationController.deleteAirportTaxiRotation(airport_taxi_id);
        if (success) {
          await fetchData();
          setSelectedRow(null);
        } else {
          console.error('Failed to delete record');
        }
      }
    } catch (error) {
      console.error('Error deleting record', error);
    }
  };

  const handleFileAction = () => {
    setViewModalVisible(true);
  };

  useEffect(() => {
    const initAndFetch = async () => {
      try {
        setLoading(true);
        // Since we're using the controller now, we might not need to explicitly initialize the database here
        // as that should be handled by the service layer. Just fetch the data.
        await fetchData();
      } catch (error) {
        console.error('Error initializing and fetching data:', error);
        setError('Failed to load data. Please restart the application.');
      } finally {
        setLoading(false);
      }
    };
    
    initAndFetch();
    
    // No need for explicit database closure here as that's handled by the service layer
  }, []);

  // TableHeader component
  const TableHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.checkboxCell]}></Text>
        <Text style={[styles.headerCell, styles.indexCell]}>ORDRE</Text>
        <Text style={styles.headerCell}>N° EXPLOITANTS</Text>
        <Text style={styles.headerCell}>COMPAGNIE AERIENNE</Text>
        <Text style={styles.headerCell}>DESTINATION</Text>
        <Text style={styles.headerCell}>N° PASSAGERS</Text>
        <Text style={styles.headerCell}>OBSERVATIONS</Text>
      </View>
    </View>
  );

  const renderItem = ({ item, index }: { item: AirportTaxiRotationData; index: number }) => {
    const isSelected = selectedRow === index;
    const isHovered = hoveredRow === index;
    
    return (
      <Pressable 
        style={[
          styles.row, 
          isSelected && styles.selectedRow,
          isHovered && styles.hoveredRow
        ]} 
        onPress={() => setSelectedRow(isSelected ? null : index)}
        onHoverIn={() => setHoveredRow(index)}
        onHoverOut={() => setHoveredRow(null)}
      >
        <View style={[styles.cell, styles.checkboxCell]}>
          <FontAwesome 
            name={isSelected ? "check-square" : "square-o"} 
            size={18} 
            color={isSelected ? "#2D80E1" : "#D1D1D1"} 
          />
        </View>
        <Text style={[styles.cell, styles.indexCell]}>{item.airport_taxi_id}</Text>
        <Text style={styles.cell}>{item.numero_exploitants}</Text>
        <Text style={styles.cell}>{item.airline_name || 'N/A'}</Text>
        <Text style={styles.cell}>{item.destination}</Text>
        <Text style={styles.cell}>{item.passenger_count}</Text>
        <Text style={styles.cell}>{item.observations || '—'}</Text>
      </Pressable>
    );
  };

  return (
    <SQLiteProvider databaseName="transport.db">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.headerTitle}>
            <Text style={styles.blueText}>PRINCESS JULIANA INTERNATIONAL AIRPORT</Text>{' '}
            <Text style={styles.redText}>ROTATIONS JOURNALIERES TAXIS AEROPORT</Text>
          </Text>
        </View>

        {/* Table */}
        <View style={styles.tableContainer}>
          <TableHeader />
          {loading ? (
            <View style={styles.messageContainer}>
              <Text>Loading data...</Text>
            </View>
          ) : error ? (
            <View style={styles.messageContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : data.length === 0 ? (
            <View style={styles.messageContainer}>
              <Text>No records found. Add a new entry to get started.</Text>
            </View>
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item, index) => `${item.airport_taxi_id || index}`}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={true}
            />
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          {/* <TouchableOpacity 
            style={styles.fileButton} 
            onPress={handleFileAction}
            activeOpacity={0.7}
            disabled={selectedRow === null}
          >
            <FontAwesome name="file-text" size={22} color="white" />
          </TouchableOpacity> */}

          {selectedRow !== null && (
            <>
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => setEditModalVisible(true)}
                activeOpacity={0.7}
              >
                <AntDesign name="edit" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <AntDesign name="delete" size={22} color="white" />
              </TouchableOpacity>

              <TouchableOpacity 
                          style={styles.policeControlButton} 
                          onPress={handlePoliceControlAction}
                          activeOpacity={0.7}
                        >
                          <FontAwesome name="shield" size={22} color="white" />
                        </TouchableOpacity>
            </>
          )}


          <TouchableOpacity 
            style={styles.fab} 
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
          >
            <AntDesign name="plus" size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* Modals */}
        <AirportTaxiRotationModal 
          modalVisible={modalVisible} 
          setModalVisible={setModalVisible} 
          onFormSubmit={handleFormSubmit}
        />
        {selectedRow !== null && (
          <EditAirportTaxiRotationModal
            modalVisible={editModalVisible}
            setModalVisible={setEditModalVisible}
            formData={data[selectedRow]}
            onFormSubmit={handleEditFormSubmit}
          />
        )}
        {/* {selectedRow !== null && data[selectedRow]?.airport_taxi_id !== undefined && (
          <AirportTaxiViewModal
            airport_taxi_id={data[selectedRow].airport_taxi_id!}
            modalVisible={viewModalVisible}
            setModalVisible={setViewModalVisible}
            formData={data[selectedRow]}
          />
        )} */}
      </View>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6F3',
    position: 'relative',
  },
  pageHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEAEA',
    backgroundColor: 'white',
  },
  tableContainer: {
    flex: 1,
    margin: 12,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
    height: 'auto',
    minHeight: '75%',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 10,
    height: 80,
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#EBEAEA',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#F9F9F8',
  },
  headerCell: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B6B6B',
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEAEA',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  selectedRow: {
    backgroundColor: 'rgba(46, 170, 220, 0.1)',
  },
  hoveredRow: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 6,
    color: '#37352F',
    textAlign: 'left',
  },
  checkboxCell: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexCell: {
    flex: 0.5,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2D80E1',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  editButton: {
    position: 'absolute',
    bottom: 78,
    right: 20,
    backgroundColor: '#F2994A',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 78,
    left: 20,
    backgroundColor: '#EB5757',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  fileButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#219653',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  blueText: {
    color: '#2D80E1',
  },
  redText: {
    color: '#EB5757',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#EB5757',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2D80E1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  policeControlButton: {
    position: 'absolute',
    bottom: 20,
    right: 78, // Positioned to the left of the plus button
    backgroundColor: '#4A6FA5', // A blue-ish color that represents police/authority
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
