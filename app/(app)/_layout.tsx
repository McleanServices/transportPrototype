import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Text, View, Pressable, Animated, Image } from 'react-native'; 
import { Redirect} from 'expo-router';
import { useAuth } from '../../context/auth';
import React from 'react';
import { useStorageState } from '../../context/useStorageState';
import { Ionicons } from '@expo/vector-icons';


export default function Layout() {

  const { session, isLoading } = useAuth();
  const bounceAnimation = new Animated.Value(0);
  const [storedName] = useStorageState('username');

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnimation, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnimation, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const bounceStyle = {
    transform: [
      {
        translateY: bounceAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  };

  const textStyle = {
    fontWeight: 'bold',
    fontSize: 15,
    textShadowColor: 'black',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (session === null) {
    return <Redirect href="../login" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" 
          options={{
            drawerLabel: 'Home',
            headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Image source={require('../../assets/images/logo.png')} style={{ width: 70, height: 50, marginRight: 20 }} />
                <Text>Fiche De Rotation - Bus</Text>
              </View>
            ),

            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                <Ionicons name="person-circle" size={24} color="black" />
                <Text style={{ marginLeft: 5 }}>
                  {storedName[1] ? storedName[1] : ''}
                </Text>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="home" 
          options={{
            drawerLabel: 'modal',
            title: 'overview',
            drawerItemStyle: { display: 'none' }, 
          }}
        />
        <Drawer.Screen
          name="modals/modal" 
          options={{
            drawerLabel: 'modal',
            title: 'overview',
            drawerItemStyle: { display: 'none' }, 
          }}
        />
        <Drawer.Screen
          name="modals/editModal" 
          options={{
            drawerLabel: 'modal',
            title: 'overview',
            drawerItemStyle: { display: 'none' }, 
          }}
        />
        <Drawer.Screen
          name="modals/camera" 
          options={{
            drawerLabel: 'camera',
            title: 'overview',
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="modals/viewModal" 
          options={{
            drawerLabel: 'modal',
            title: 'overview',
            drawerItemStyle: { display: 'none' }, 
          }}
        />
        <Drawer.Screen
          name="fiche/control" 
          options={{
            drawerLabel: 'fiche',
            title: 'overview',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
