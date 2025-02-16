import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 
import ModalForm from './modals/modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SQLiteProvider } from 'expo-sqlite';

interface FormData {
  exploitants: string;
  arrivalTime: string;
  departureTime: string;
  passengers: string;
  observations: string;
  order?: number;
}

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<FormData[]>([]);

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
              <Text style={[styles.cell, { flex: 0.5 }]}>{item.order}</Text>
              <Text style={styles.cell}>{item.exploitants}</Text>
              <Text style={styles.cell}>{new Date(item.arrivalTime).toLocaleTimeString()}</Text>
              <Text style={styles.cell}>{new Date(item.departureTime).toLocaleTimeString()}</Text>
              <Text style={styles.cell}>{item.passengers}</Text>
              <Text style={styles.cell}>{item.observations}</Text>
            </View>
          )}
          contentContainerStyle={{
            flexGrow: 1,
            padding: 20,
          }}
        />
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
        <ModalForm modalVisible={modalVisible} setModalVisible={setModalVisible} onFormSubmit={handleFormSubmit} />
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
});
