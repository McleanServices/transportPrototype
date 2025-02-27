import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView } from 'react-native';
import airportTaxiRotationService from '../model/airportTaxiRotationService';

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

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Enter SQL query"
        style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
      />
      <Button title="Execute Query" onPress={executeQuery} />
      {error && <Text style={{ color: 'red', marginTop: 16 }}>{error}</Text>}
      <View style={{ marginTop: 16 }}>
        {results.map((result, index) => (
          <Text key={index}>{JSON.stringify(result)}</Text>
        ))}
      </View>
    </ScrollView>
  );
}
