import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { AntDesign, FontAwesome } from '@expo/vector-icons'; 
import { SQLiteProvider } from 'expo-sqlite'; // Ensure this import is correct
import { useBusRotationData } from '../hooks/useBusRotationData';
import BusRotationModal from '../modals/busRotationModal';
import EditBusRotationModal from '../modals/editBusRotationModal';

export default function BusRotationFiche(){
  const {
    modalVisible,
    setModalVisible,
    data,
    selectedRow,
    editModalVisible,
    setEditModalVisible,
    viewModalVisible,
    setViewModalVisible,
    handleFormSubmit,
    handleEditFormSubmit,
    handleRowSelect,
    handleEditPress,
    handleViewPress,
    refreshData,  // Make sure this is available from the hook
  } = useBusRotationData();

  const handleModalSubmit = async (formData: any) => {
    try {
      await handleFormSubmit(formData);
      await refreshData();  // Refresh the data after submission
    } catch (error) {
      console.error('Error handling form submission:', error);
      alert('An error occurred while saving the data.');
    }
  };

  return (
    <SQLiteProvider databaseName="transport.db">
      <View style={{ flex: 1 }}>
        <Text style={styles.headerTitle}>
          <Text style={styles.blueText}>GARE ROUTIERE GUMBS ANTOINE JULIEN</Text> <Text style={styles.redText}>ROTATIONS JOURNALIERES EXPLOITANTS BUS TCP/TCI/ZH</Text>
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
              <Text style={{ flex: 0.5, textAlign: "center" }}>N* D'ORDRE</Text> 
              <View style={{ width: 1, backgroundColor: "#000" }} />
              <Text style={{ flex: 1, textAlign: "center" }}>N EXPLOITANTS</Text>
              <View style={{ width: 1, backgroundColor: "#000" }} />
              <Text style={{ flex: 1, textAlign: "center" }}>HEURE D'ARRIVEE</Text>
              <View style={{ width: 1, backgroundColor: "#000" }} />
              <Text style={{ flex: 1, textAlign: "center" }}>HEURE DE DEPART</Text>
              <View style={{ width: 1, backgroundColor: "#000" }} />
              <Text style={{ flex: 1, textAlign: "center" }}>N PASSAGERS</Text>
              <View style={{ width: 1, backgroundColor: "#000" }} />
              <Text style={{ flex: 1, textAlign: "center" }}>OBSERVATIONS/REMARQUES</Text>
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
              <Text style={styles.cell}>{new Date(item.arrival_time).toLocaleTimeString()}</Text>
              <Text style={styles.cell}>{item.departure_time ? new Date(item.departure_time).toLocaleTimeString() : 'null'}</Text>
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
        <BusRotationModal 
          modalVisible={modalVisible} 
          setModalVisible={setModalVisible} 
          onFormSubmit={handleModalSubmit}  // Use the new handler
        />
        {selectedRow !== null && (
          <EditBusRotationModal
            modalVisible={editModalVisible}
            setModalVisible={setEditModalVisible}
            formData={data[selectedRow]}
            onFormSubmit={handleEditFormSubmit}
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
