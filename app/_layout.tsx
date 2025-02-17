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
          name="modals/modal" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'modal',
            title: 'overview',
            drawerItemStyle: { display: 'none' }, // Hide this screen
          }}
        />
        <Drawer.Screen
          name="modals/editModal" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'modal',
            title: 'overview',
            drawerItemStyle: { display: 'none' }, // Hide this screen
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
