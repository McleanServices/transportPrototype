import React, { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet, TextInput, Image } from 'react-native';
import CameraModal from './camera'; // Import the CameraModal component
import ViewImagesModal from './viewImagesModal'; // Import the ViewImagesModal component

interface ViewModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  formData: any;
  imageUri: string | null;
  onCapture: (uri: string) => void;
}

const ViewModal: React.FC<ViewModalProps> = ({ modalVisible, setModalVisible, formData, imageUri, onCapture }) => {
  const [cameraVisible, setCameraVisible] = useState(false);
  const [viewImagesVisible, setViewImagesVisible] = useState(false);

  const handleCapture = (uri: string) => {
    onCapture(uri);
    setCameraVisible(false);
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
          <Text style={styles.modalText}>N* D'ORDRE: {formData.order} N EXPLOITANTS: {formData.exploitants}</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={formData.observations}
              editable={false}
            />
            {imageUri ? (
              <Image
                style={styles.imagePlaceholder}
                source={{ uri: imageUri }}
              />
            ) : (
              <Image
                style={styles.imagePlaceholder}
                source={require('../../assets/images/image.jpg')}
              />
            )}
          </View>
          <Button title="Add Image" onPress={() => setCameraVisible(true)} />
          <Button title="View All Images" onPress={() => setViewImagesVisible(true)} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </View>
      <Modal visible={cameraVisible} animationType="slide">
        <CameraModal onCapture={handleCapture} onClose={() => setCameraVisible(false)} />
      </Modal>
      <ViewImagesModal
        modalVisible={viewImagesVisible}
        setModalVisible={setViewImagesVisible}
        imageUri={imageUri}
      />
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
