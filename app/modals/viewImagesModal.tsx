import React from 'react';
import { Modal, View, Text, Button, StyleSheet, FlatList, Image } from 'react-native';

interface ViewImagesModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  imageUri: string | null;
}

const ViewImagesModal: React.FC<ViewImagesModalProps> = ({ modalVisible, setModalVisible, imageUri }) => {
  const images = imageUri ? [imageUri] : []; // Replace with actual logic to fetch all images for the specific row

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
            data={images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image
                style={styles.image}
                source={{ uri: item }}
              />
            )}
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
});

export default ViewImagesModal;
