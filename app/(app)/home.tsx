import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { AntDesign, FontAwesome } from '@expo/vector-icons'; 
import ModalForm from './modals/modal';
import EditModal from './modals/editModal';
import ViewModal from './modals/viewModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SQLiteProvider } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';
import { useAuth } from '../../context/auth'; // Import useAuth

interface FormData {
  id: number; // Add id property
  exploitants: string;
  arrivalTime: string;
  departureTime: string | null; // Allow departureTime to be null
  passengers: string | null; // Allow passengers to be null
  observations: string | null; // Allow observations to be null
  order?: number;
}

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<FormData[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const { signOut } = useAuth(); // Get signOut function from useAuth

  const fetchData = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('transport.db');
      await db.withTransactionAsync(async () => {
        const result = await db.getAllAsync(`
          SELECT * FROM Transport_rotation_fiche
        `);
        
        // Check if result exists and has the expected structure
        if (result && Array.isArray(result)) {
          setData(result as FormData[]);
        } else {
          console.warn('Unexpected result structure:', result);
          setData([]);
        }
      });
    } catch (error) {
      console.error('Error fetching data from database', error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    // Refresh the table if any item has an empty id
    if (data.some(item => !item.id)) {
      fetchData();
    }
  }, [data]);
  
  const handleFormSubmit = (newFormData: FormData) => {
    setData((prevData) => {
      const updatedData = [
        ...prevData,
        { ...newFormData, order: prevData.length + 1 }
      ];
      AsyncStorage.setItem('formData', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const handleRowSelect = (index: number) => {
    setSelectedRow((prevSelectedRow) => (prevSelectedRow === index ? null : index));
  };

  const handleEditPress = () => {
    setEditModalVisible(true);
  };

  const handleEditFormSubmit = (updatedFormData: FormData) => {
    setData((prevData) => {
      const updatedData = prevData.map((item, index) =>
        index === selectedRow ? updatedFormData : item
      );
      AsyncStorage.setItem('formData', JSON.stringify(updatedData));
      return updatedData;
    });
    setEditModalVisible(false);
  };

  const handleViewPress = (index: number) => {
    setSelectedRow(index);
    setViewModalVisible(true);
  };

  return (
    <SQLiteProvider databaseName="transport.db">
      <View style={{ flex: 1 }}>
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
              <Text style={[styles.cell, { flex: 0.5 }]}>{item.id}</Text> 
              <Text style={styles.cell}>{item.exploitants}</Text>
              <Text style={styles.cell}>{new Date(item.arrivalTime).toLocaleTimeString()}</Text>
              <Text style={styles.cell}>{item.departureTime ? new Date(item.departureTime).toLocaleTimeString() : 'null'}</Text>
              <Text style={styles.cell}>{item.passengers}</Text>
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
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
        <ModalForm modalVisible={modalVisible} setModalVisible={setModalVisible} onFormSubmit={handleFormSubmit} />
        {selectedRow !== null && (
          <EditModal
            modalVisible={editModalVisible}
            setModalVisible={setEditModalVisible}
            formData={data[selectedRow]}
            onFormSubmit={handleEditFormSubmit}
          />
        )}
        {selectedRow !== null && (
          <ViewModal
          transport_fiche_id={data[selectedRow].id}
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
    bottom: 20,
    right: 90,
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
  signOutButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  signOutButtonText: {
    color: 'white',
  },
});
