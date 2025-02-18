import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { AntDesign, FontAwesome } from '@expo/vector-icons'; 
import ModalForm from '../modals/modal';
import EditModal from '../modals/editModal';
import ViewModal from '../modals/viewModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SQLiteProvider } from 'expo-sqlite';
import axios from 'axios';
import * as SQLite from 'expo-sqlite';
import { useAuth } from '../../context/auth'; // Import useAuth

interface FormData {
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
  const [imageUris, setImageUris] = useState<{ [key: number]: string[] }>({}); // Change to array of image URIs
  const { signOut } = useAuth(); // Get signOut function from useAuth

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('formData');
        if (storedData) {
          setData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchImageUris = async () => {
      try {
        const storedImageUris = await AsyncStorage.getItem('imageUris');
        if (storedImageUris) {
          const parsedImageUris = JSON.parse(storedImageUris);
          if (Array.isArray(parsedImageUris)) {
            console.log('Fetched imageUris:', parsedImageUris); // Debug log
            setImageUris(parsedImageUris);
          } else {
            console.error('Fetched imageUris is not an array:', parsedImageUris);
          }
        }
      } catch (error) {
        console.error('Error fetching image URIs', error);
      }
    };

    fetchImageUris();
  }, []);

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

  const handleCapture = (uri: string, index: number) => {
    setImageUris((prevUris) => {
      const updatedUris = {
        ...prevUris,
        [index]: [...(prevUris[index] || []), uri], // Append new image URI
      };
      console.log('Updated imageUris:', updatedUris); // Debug log
      AsyncStorage.setItem('imageUris', JSON.stringify(updatedUris));
      return updatedUris;
    });
  };

  const handlePublishToServer = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('transport.db');
  
      await db.withTransactionAsync(async () => {
        const result = await db.getFirstAsync('SELECT COUNT(*) FROM Transport_rotation_fiche');
        
        const countResult = (result as any).rows._array[0];
        console.log('Count:', countResult['COUNT(*)']);
  
        const dataResult = await db.getAllAsync('SELECT * FROM Transport_rotation_fiche');
  
        let dataToPublish: any[] = [];
  
        if (dataResult && (dataResult as any).rows._array.length > 0) {
          dataToPublish = (dataResult as any).rows._array;
  
          for (const row of dataToPublish) {
            await axios.post('https://a417-194-3-170-45.ngrok-free.app/api/transport_rotation_fiche', row);
          }
          alert('Data published to server successfully');
        } else {
          console.error('No data found in Transport_rotation_fiche');
          alert('No data found to publish.');
        }
      });
    } catch (error) {
      console.error('Error publishing data to server', error);
      alert('An error occurred while publishing data to the server. Please try again.');
    }
  };

  const handleDeleteAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem('formData');
      setData([]);
      alert('AsyncStorage data deleted successfully');
    } catch (error) {
      console.error('Error deleting AsyncStorage data', error);
      alert('An error occurred while deleting AsyncStorage data. Please try again.');
    }
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
              <Text style={[styles.cell, { flex: 0.5 }]}>{item.order}</Text>
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
            modalVisible={viewModalVisible}
            setModalVisible={setViewModalVisible}
            formData={data[selectedRow]}
            imageUris={imageUris[selectedRow] || []} // Pass array of image URIs
            onCapture={(uri) => handleCapture(uri, selectedRow)}
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
