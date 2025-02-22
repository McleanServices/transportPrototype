import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Text, View, Pressable, Animated, Image } from 'react-native'; 
import { Redirect} from 'expo-router';
import { useAuth } from '../../context/auth';
import React from 'react';
import { useStorageState } from '../../context/useStorageState';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import HeaderTitle from '../../components/HeaderTitle';

export default function Layout() {

  const { session, isLoading } = useAuth();
  const bounceAnimation = new Animated.Value(0);
  const [storedEmail] = useStorageState('email');
  const router = useRouter();

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
              <HeaderTitle 
                logoSource={require('../../assets/images/logo.png')} 
                title="DIRECTION TRANSPORT ET REGLEMENTATIONS" 
              />
            ),
            headerRight: () => (
              <Pressable onPress={() => router.push('/parametres')}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                  <Ionicons name="person-circle" size={24} color="black" />
                  <Text style={{ marginLeft: 5 }}>
                    {storedEmail ? storedEmail : ''}
                  </Text>
                </View>
              </Pressable>
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
            headerTitle: () => (
              <HeaderTitle 
                logoSource={require('../../assets/images/logo.png')} 
                title="DIRECTION TRANSPORT ET REGLEMENTATIONS" 
              />
            ),
            title: 'overview',
          }}
        />
        
      </Drawer>
    </GestureHandlerRootView>
  );
}
