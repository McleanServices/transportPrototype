import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Text, View, Pressable, Animated } from 'react-native'; 
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import HeaderTitle from '../../components/header/HeaderTitle';

export default function Layout() {

  const bounceAnimation = React.useMemo(() => new Animated.Value(0), []);
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
  }, [bounceAnimation]);

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
                  <Text style={{ marginLeft: 5 }}></Text>
                </View>
              </Pressable>
            ),
          }}
        />
        <Drawer.Screen
          name="fiche/control" 
          options={{
            drawerItemStyle: { display: 'none' },
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
        <Drawer.Screen
          name="view/busRotationFiche" 
          options={{
            drawerLabel: 'Bus Rotation Fiche',
            headerTitle: () => (
              <HeaderTitle 
                logoSource={require('../../assets/images/logo.png')} 
                title="DIRECTION TRANSPORT ET REGLEMENTATIONS" 
              />
            ),
            title: 'overview',
          }}
        />
         <Drawer.Screen
          name="view/marigotTaxiRotationFiche" 
          options={{
            drawerLabel: 'Marigot Rotation Fiche',
            headerTitle: () => (
              <HeaderTitle 
                logoSource={require('../../assets/images/logo.png')} 
                title="DIRECTION TRANSPORT ET REGLEMENTATIONS" 
              />
            ),
            title: 'overview',
          }}
        />
         <Drawer.Screen
          name="view/airportTaxiRotationFiche" 
          options={{
            drawerLabel: 'Airport Rotation Fiche',
            headerTitle: () => (
              <HeaderTitle 
                logoSource={require('../../assets/images/logo.png')} 
                title="DIRECTION TRANSPORT ET REGLEMENTATIONS" 
              />
            ),
            title: 'overview',
          }}
        />
        <Drawer.Screen
          name="parametres" 
          options={{
            drawerItemStyle: { display: 'none' },
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
       
        <Drawer.Screen
          name="sqlQueryScreen"
          options={{
            drawerItemStyle: { display: 'none' },
            drawerLabel: 'SQL Query',
            headerTitle: () => (
              <HeaderTitle 
                logoSource={require('../../assets/images/logo.png')} 
                title="DIRECTION TRANSPORT ET REGLEMENTATIONS" 
              />
            ),
          }}
        />
        <Drawer.Screen
          name="camera"
          options={{
            drawerItemStyle: { display: 'none' },
            drawerLabel: 'SQL Query',
            headerTitle: () => (
              <HeaderTitle 
                logoSource={require('../../assets/images/logo.png')} 
                title="DIRECTION TRANSPORT ET REGLEMENTATIONS" 
              />
            ),
          }}
        />
        <Drawer.Screen
          name="webViewScreen"
          options={{
            drawerLabel: 'Power Bi Report',
            headerTitle: () => (
              <HeaderTitle 
                logoSource={require('../../assets/images/logo.png')} 
                title="DIRECTION TRANSPORT ET REGLEMENTATIONS" 
              />
            ),
          }}
        />
        <Drawer.Screen
          name="model/airportTaxiRotationService"
          options={{
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="model/busRotationService"
          options={{
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="model/marigotTaxiRotationService"
          options={{
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="model/ucvformService"
          options={{
            drawerItemStyle: { display: 'none' },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );

  // TODO: clean up file structure 
// TODO: fix spelling mistakes
// TODO: 

}
