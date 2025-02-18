import React from 'react';
import { Modal, View, Text, Button, StyleSheet, FlatList, Image } from 'react-native';

interface ViewImagesModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  imageUris: string[]; // Change to array of image URIs
}

const ViewImagesModal: React.FC<ViewImagesModalProps> = ({ modalVisible, setModalVisible, imageUris }) => {
  let extractedImageUris: string[] = [];
  try {
    // Extract the array from the object if necessary
    extractedImageUris = Array.isArray(imageUris) ? imageUris : imageUris[0] || Object.values(imageUris)[0];
  } catch (error) {
    console.error('Error extracting image URIs:', error);
  }

  console.log('ViewImagesModal imageUris:', extractedImageUris); // Debug log

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>All Images</Text>
          <FlatList
            data={extractedImageUris}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image
                style={styles.image}
                source={{ uri: item }}
              />
            )}
            contentContainerStyle={styles.imageList} // Add contentContainerStyle
          />
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
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  imageList: {
    alignItems: 'center', // Center the images
  },
});

export default ViewImagesModal;

// TODO: Fix error when fetched imageUris is not an array
