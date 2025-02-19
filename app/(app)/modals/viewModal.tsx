import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, StyleSheet, TextInput, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';

interface ViewModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  formData: any;
  imageUris: string[];
  id: number; // Add id prop
}

const convertToArray = (data: any): string[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object') {
    // Handle case where data is an object with numeric keys
    const values = Object.values(data).flat().filter(Boolean);
    if (values.every(value => typeof value === 'string')) {
      return values as string[];
    }
  }
  return [];
};

const ViewModal: React.FC<ViewModalProps> = ({ modalVisible, setModalVisible, formData, imageUris, id }) => {
  const db = SQLite.openDatabaseSync('transport.db');
  const [editData, setEditData] = useState(formData);
  const [viewImagesVisible, setViewImagesVisible] = useState(false);
  const [imageArray, setImageArray] = useState<string[]>([]);

  useEffect(() => {
    const fetchImageUris = async () => {
      try {
        const storedUris = await AsyncStorage.getItem(`imageUris_${id}`);
        if (storedUris) {
          setImageArray(JSON.parse(storedUris));
        }
      } catch (error) {
        console.error('Error fetching image URIs', error);
      }
    };

    fetchImageUris();
  }, [id]);

  useEffect(() => {
    const createTables = async () => {
      try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS Camera (
            id INTEGER,
            imageUris TEXT,
            FOREIGN KEY (id) REFERENCES Transport_rotation_fiche(id)
          );
        `);
      } catch (error) {
        console.error('Error creating Camera table', error);
      }
    };

    createTables();
  }, []);

  const insertIntoCameraTable = async (id: number, imageUris: string[]) => {
    try {
      const imageUrisString = JSON.stringify(imageUris);
      const result = await db.runAsync(`
        INSERT INTO Camera (id, imageUris)
        VALUES (?, ?);
      `, [id, imageUrisString]);
      console.log('Insert result:', result);
    } catch (error) {
      console.error('Error inserting into Camera table', error);
    }
  };

  const clearStoredUris = async () => {
    try {
      await AsyncStorage.removeItem(`imageUris_${id}`);
      setImageArray([]);
      console.log('Stored URIs cleared');
    } catch (error) {
      console.error('Error clearing stored URIs', error);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setEditData({ ...editData, [name]: value });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>N* D'ORDRE: {id} N EXPLOITANTS: {editData.exploitants}</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={editData.observations}
              onChangeText={(value) => handleInputChange('observations', value)}
            />
            {imageArray.length > 0 ? (
              <Image
                style={styles.imagePlaceholder}
                source={{ uri: imageArray[imageArray.length - 1] }} // Display the last captured image
              />
            ) : (
              <Image
                style={styles.imagePlaceholder}
                source={require('../../../assets/images/image.jpg')}
              />
            )}
          </View>
          <Button title="Clear Images" onPress={clearStoredUris} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
  },
});

export default ViewModal;
