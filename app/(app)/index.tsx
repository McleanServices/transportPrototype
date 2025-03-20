import { useAuth } from '../../context/auth';
import { useStorageState } from '../../context/useStorageState';
import { Text, View, StyleSheet } from 'react-native';

export default function Index() {
  const { session } = useAuth();
  const [storedEmail] = useStorageState('nom');

  if (!session) return null;

  return (
    <View style={styles.container}>
      <Text>Bonjour {storedEmail ? storedEmail : ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});