import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Home',
            title: 'Fiche De Rotation - Bus',
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
            drawerLabel: 'modal',
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
          name="modals/viewImagesModal" 
          options={{
            drawerLabel: 'modal',
            title: 'overview',
            drawerItemStyle: { display: 'none' }, 
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
