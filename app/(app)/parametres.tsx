import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';

const Settings = () => {
  const router = useRouter();

  const signOut = () => {
    router.push('/login');
  };

  return (
    <View style={{ flex: 1 }}>
      <Text>Settings</Text>
      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  signOutButton: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: 50 }],
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  signOutButtonText: {
    color: 'white',
  },
});

export default Settings;
