import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView } from 'react-native';
import airportTaxiRotationService from './model/airportTaxiRotationService';
import busRotationService from './model/busRotationService';

export default function SQLQueryScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = async () => {
    try {
      setError(null);
      const result = await airportTaxiRotationService.executeSQLQuery(query);
      setResults(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const syncDatabase = async () => {
    try {
      const data = await busRotationService.getAllBusRotationsForSync();
      const response = await fetch('https://techwithtyrece.com/api/sync-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        alert('Database synced successfully');
      } else {
        const errorText = await response.text();
        console.error('Sync failed with status:', response.status, 'Response:', errorText);
        alert('Failed to sync database');
      }
    } catch (error) {
      console.error('Error syncing databases:', error);
      alert('Error syncing databases');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Enter SQL query"
        style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
      />
      <Button title="Execute Query" onPress={executeQuery} />
      <Button title="Sync Database" onPress={syncDatabase} />
      {error && <Text style={{ color: 'red', marginTop: 16 }}>{error}</Text>}
      <View style={{ marginTop: 16 }}>
        {results.map((result, index) => (
          <Text key={index}>{JSON.stringify(result)}</Text>
        ))}
      </View>
    </ScrollView>
  );
}
