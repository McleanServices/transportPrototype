import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList, Pressable } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { SQLiteProvider } from 'expo-sqlite';
import { useRouter } from 'expo-router';

import BusRotationModal from '../../components/modals/create/busRotationModal';
import EditBusRotationModal from '../../components/modals/update/editBusRotationModal';
import ViewModal from '../../components/modals/viewModal';

import {
  fetchAllBusRotations,
  createBusRotation,
  updateBusRotation,
  deleteBusRotation,
} from '../controller/busRotationController';
import { BusRotationData } from '../model/busRotationService';

export default function BusRotationFiche() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [data, setData] = useState<BusRotationData[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const todayDate = new Date().toLocaleDateString('fr-FR');

  const fetchData = async () => {
    try {
      const records = await fetchAllBusRotations();
      setData(records);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFormSubmit = async (formData: BusRotationData) => {
    try {
      await createBusRotation(formData);
      await fetchData();
      setModalVisible(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEditFormSubmit = async (formData: BusRotationData) => {
    if (selectedRow === null) return;

    try {
      const bus_rotation_id = data[selectedRow].bus_rotation_id;
      if (bus_rotation_id !== undefined) {
        await updateBusRotation(bus_rotation_id, formData);
        await fetchData();
        setEditModalVisible(false);
      }
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  const handleDelete = async () => {
    if (selectedRow === null) return;

    try {
      const bus_rotation_id = data[selectedRow].bus_rotation_id;
      if (bus_rotation_id !== undefined) {
        await deleteBusRotation(bus_rotation_id);
        await fetchData();
        setSelectedRow(null);
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleFileAction = () => {
    setViewModalVisible(true);
  };

  const handlePoliceControlAction = () => {
    if (selectedRow !== null) {
      const additionalVariable = "bus"; 
      const airport_taxi_rotation_id = data[selectedRow].bus_rotation_id;
      if (airport_taxi_rotation_id !== undefined) {
        // Navigate to the police control screen with the bus_rotation_id
        console.log('id is',airport_taxi_rotation_id);
        router.push(`/fiche/control?airport_taxi_rotation_id=${airport_taxi_rotation_id}&type=${additionalVariable}`);
      } else {
        alert("Please select a bus rotation first");
      }
    } else {
      alert("Please select a bus rotation first");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item, index }: { item: BusRotationData; index: number }) => {
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
        <Text style={[styles.cell, styles.indexCell]}>{index}</Text>
        <Text style={styles.cell}>{item.numero_exploitants}</Text>
        <Text style={styles.cell}>{new Date(item.arrival_time).toLocaleTimeString()}</Text>
        <Text style={styles.cell}>{item.departure_time ? new Date(item.departure_time).toLocaleTimeString() : '—'}</Text>
        <Text style={styles.cell}>{item.passenger_count}</Text>
        <Text style={styles.cell}>{item.observations || '—'}</Text>
      </Pressable>
    );
  };

  // Fixed table header component
  const TableHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.checkboxCell]}></Text>
        <Text style={[styles.headerCell, styles.indexCell]}>ORDRE</Text>
        <Text style={styles.headerCell}>N° EXPLOITANTS</Text>
        <Text style={styles.headerCell}>HEURE D'ARRIVEE</Text>
        <Text style={styles.headerCell}>HEURE DE DEPART</Text>
        <Text style={styles.headerCell}>N° PASSAGERS</Text>
        <Text style={styles.headerCell}>OBSERVATIONS/REMARQUES</Text>
      </View>
    </View>
  );

  return (
    <SQLiteProvider databaseName="transport.db">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.headerTitle}>
            <Text style={styles.blueText}>GARE ROUTIERE GUMBS ANTOINE JULIEN</Text>{' '}
            <Text style={styles.redText}>ROTATIONS JOURNALIERES EXPLOITANTS BUS TCP/TCI/Z</Text>{' '}
            <Text style={styles.blueText}>{todayDate}</Text>
          </Text>
        </View>

        {/* Table */}
        <View style={styles.tableContainer}>
          <TableHeader />
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={true}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.fileButton} 
            onPress={handleFileAction}
            activeOpacity={0.7}
          >
            <FontAwesome name="file-text" size={22} color="white" />
          </TouchableOpacity>

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
        <BusRotationModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onFormSubmit={handleFormSubmit}
        />
        
        {selectedRow !== null && (
          <EditBusRotationModal
            modalVisible={editModalVisible}
            setModalVisible={setEditModalVisible}
            formData={data[selectedRow]}
            onFormSubmit={handleEditFormSubmit}
          />
        )}
        
        <ViewModal
          modalVisible={viewModalVisible}
          setModalVisible={setViewModalVisible}
          data={data}
        />
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
    marginBottom: 10, // Add space at bottom to prevent action buttons overlap
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
    height: 'auto', // Allow container to expand
    minHeight: '75%', // Ensure table takes at least 75% of available space
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16, // Add some padding at the bottom for better scrolling
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 10,
    height: 80, // Fixed height for action buttons area
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#EBEAEA',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8, // Reduced padding to save space
    paddingHorizontal: 8,
    backgroundColor: '#F9F9F8',
  },
  headerCell: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 3, // Reduced padding to save space
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
    paddingVertical: 6, // Reduced padding to fit more rows
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
  headerTitle: {
    fontSize: 15, // Slightly smaller header title
    fontWeight: 'bold',
    textAlign: 'center',
  },
  blueText: {
    color: '#2D80E1',
  },
  redText: {
    color: '#EB5757',
  },
});
