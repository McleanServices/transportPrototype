import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { Button, Pressable, StyleSheet, Text, View, Image, FlatList } from "react-native"; // Updated import
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite'; // Updated import
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CameraApp() {
  const { transport_fiche_id } = useLocalSearchParams();
  console.log('Local Search Params ID:', transport_fiche_id);
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [mode, setMode] = useState<CameraMode>("picture");
  const [facing, setFacing] = useState<CameraType>("back");
  const [recording, setRecording] = useState(false);
  const db = useSQLiteContext();
  const [photos, setPhotos] = useState<any[]>([]);
  const [asyncPhotos, setAsyncPhotos] = useState<any[]>([]);

  useEffect(() => {
    const createTable = async () => {
      try {
        await db.execAsync(`
          PRAGMA foreign_keys = ON;
          CREATE TABLE IF NOT EXISTS Photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uri TEXT,
            transport_fiche_id INTEGER,
            FOREIGN KEY (transport_fiche_id) REFERENCES Transport_rotation_fiche(id) ON DELETE CASCADE
          );
        `);
      } catch (error) {
        console.error('Error creating Photos table', error);
      }
    };

    createTable();
  }, [db]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const result = await getPhotosById(parseInt(transport_fiche_id as string));
      setPhotos(result);
      await AsyncStorage.setItem('photos', JSON.stringify(result));
    };
    fetchPhotos();
  }, [transport_fiche_id]);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) {
      setUri(photo.uri);
      try {
        await db.runAsync(
          'INSERT INTO Photos (uri, transport_fiche_id) VALUES (?, ?)',
          [photo.uri, parseInt(transport_fiche_id as string)]
        );
        console.log('Photo URI saved to database:', photo.uri);
        // Refresh the photos state to get the latest photos
        const updatedPhotos = await getPhotosById(parseInt(transport_fiche_id as string));
        setPhotos(updatedPhotos);
      } catch (error) {
        console.error('Error saving photo URI to database', error);
        alert('An error occurred while saving the photo URI. Please try again.');
      }
    }
  };

  const recordVideo = async () => {
    if (recording) {
      setRecording(false);
      ref.current?.stopRecording();
      return;
    }
    setRecording(true);
    const video = await ref.current?.recordAsync();
    console.log({ video });
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "picture" ? "video" : "picture"));
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const logAllPhotos = async () => {
    try {
      const result = await db.getAllAsync('SELECT * FROM Photos');
      console.log('All photos:', result);
    } catch (error) {
      console.error('Error fetching photos from database', error);
      alert('An error occurred while fetching the photos. Please try again.');
    }
  };

  const getPhotosById = async (id: number) => {
    try {
      const result = await db.getAllAsync('SELECT * FROM Photos WHERE transport_fiche_id = ?', [id]);
      console.log(`Photos for transport_fiche_id ${id}:`, result);
      return result;
    } catch (error) {
      console.error('Error fetching photos by ID from database', error);
      alert('An error occurred while fetching the photos by ID. Please try again.');
      return [];
    }
  };

  const renderPicture = () => {
    return (
      <View>
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.uri }}
              style={{ width: 300, aspectRatio: 1 }}
            />
          )}
        />
        <Button onPress={() => setUri(null)} title="Take another picture" />
        <Button onPress={async () => {
          await AsyncStorage.removeItem('photos');
          router.back();
        }} title="Finish" />
        <Button onPress={() => console.log('Stored photos:', asyncPhotos)} title="Display Console" />
        <Button onPress={async () => {
          const result = await getPhotosById(parseInt(transport_fiche_id as string));
          console.log(`Photos for transport_fiche_id ${transport_fiche_id}:`, result);
        }} title="Log Photos for Current ID" />
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <CameraView
        style={styles.camera}
        ref={ref}
        mode={mode}
        facing={facing}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      >
        <View style={styles.shutterContainer}>
          <Pressable onPress={toggleMode}>
            {mode === "picture" ? (
              <AntDesign name="picture" size={32} color="white" />
            ) : (
              <Feather name="video" size={32} color="white" />
            )}
          </Pressable>
          <Pressable onPress={mode === "picture" ? takePicture : recordVideo}>
            {({ pressed }) => (
              <View
                style={[
                  styles.shutterBtn,
                  {
                    opacity: pressed ? 0.5 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.shutterBtnInner,
                    {
                      backgroundColor: mode === "picture" ? "white" : "red",
                    },
                  ]}
                />
              </View>
            )}
          </Pressable>
          <Pressable onPress={toggleFacing}>
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
        <Button onPress={logAllPhotos} title="Log All Photos" />
      </CameraView>
    );
  };

  return (
    <View style={styles.container}>
      {uri ? renderPicture() : renderCamera()}
    </View>
  );
}

export default function App() {
  return (
    <SQLiteProvider databaseName="transport.db">
      <CameraApp />
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
});