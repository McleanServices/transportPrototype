import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ControlScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Police Control Screen</Text>
      <Text style={styles.subtitle}>This is a placeholder for the police control functionality.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6F3',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D80E1',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#37352F',
    textAlign: 'center',
  },
});