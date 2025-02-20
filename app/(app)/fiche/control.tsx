import React, { useRef, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
  Image,
  TouchableOpacity,
} from 'react-native';

const Control = () => {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [dateTime, setDateTime] = useState(new Date());
  const [station, setStation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [showStationDropdown, setShowStationDropdown] = useState(false);
  const [showOccupationDropdown, setShowOccupationDropdown] = useState(false);
  const [assistants, setAssistants] = useState([{ nom: '', prenom: '' }]);

  const stations = ["Marigot", "Grand Case"];
  const occupations = ["Taxi Driver", "Transport Operator"];

  const addAssistant = () => {
    setAssistants([...assistants, { nom: '', prenom: '' }]);
  };

  const updateAssistant = (index: number, field: 'nom' | 'prenom', value: string) => {
    const newAssistants = [...assistants];
    newAssistants[index][field] = value;
    setAssistants(newAssistants);
  };

  const removeAssistant = (index: number) => {
    const newAssistants = assistants.filter((_, i) => i !== index);
    setAssistants(newAssistants);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          <View style={styles.inner}>
            <View style={{ alignItems: 'center', padding: 10 }}>
              <Image source={{ uri: 'path_to_logo' }} style={{ width: 100, height: 100 }} />
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'green' }}>Fiche d’Information – Unité Contrôle et Vérification (UCV)</Text>
              <Text style={{ fontSize: 18 }}>DIRECTION TRANSPORT ET REGLEMENTATIONS – Service des Activités Règlementées</Text>
              <Text style={{ fontSize: 16 }}>{dateTime.toLocaleString()}</Text>
            </View>
            <View style={{ padding: 10 }}>
              <TouchableOpacity onPress={() => setShowStationDropdown(!showStationDropdown)} style={styles.input}>
                <Text>{station || "Select Station"}</Text>
              </TouchableOpacity>
              {showStationDropdown && (
                <View style={styles.dropdown}>
                  {stations.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => { setStation(item); setShowStationDropdown(false); }}>
                      <Text style={styles.dropdownItem}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <View style={{ padding: 10 }}>
              <Text>Nom:</Text>
              <TextInput style={styles.input} placeholder="Nom" />
              <Text>Prénom:</Text>
              <TextInput style={styles.input} placeholder="Prénom" />
            </View>
            <View style={{ padding: 10 }}>
              <Text style={styles.heading}>Assistants (if any)</Text>
              {assistants.map((assistant, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text>Nom:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nom"
                    value={assistant.nom}
                    onChangeText={(text) => updateAssistant(index, 'nom', text)}
                  />
                  <Text>Prénom:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Prénom"
                    value={assistant.prenom}
                    onChangeText={(text) => updateAssistant(index, 'prenom', text)}
                  />
                  <Button title="Remove Assistant" onPress={() => removeAssistant(index)} />
                </View>
              ))}
              <Button title="Add Assistant" onPress={addAssistant} />
            </View>
            <View style={{ padding: 10 }}>
              <Text style={styles.heading}>Mise en Cause</Text>
              <Text>Nom du Chauffeur:</Text>
              <TextInput style={styles.input} placeholder="Nom du Chauffeur" />
              <Text>Prénom:</Text>
              <TextInput style={styles.input} placeholder="Prénom" />
              <Text>Né(e) le:</Text>
              <TextInput style={styles.input} placeholder="Date de Naissance" />
              <Text>Lieu de Naissance:</Text>
              <TextInput style={styles.input} placeholder="Lieu de Naissance" />
              <Text>Domicile:</Text>
              <TextInput style={styles.input} placeholder="Domicile" />
              <Text>Occupation:</Text>
              <TouchableOpacity onPress={() => setShowOccupationDropdown(!showOccupationDropdown)} style={styles.input}>
                <Text>{occupation || "Select Occupation"}</Text>
              </TouchableOpacity>
              {showOccupationDropdown && (
                <View style={styles.dropdown}>
                  {occupations.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => { setOccupation(item); setShowOccupationDropdown(false); }}>
                      <Text style={styles.dropdownItem}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <Text>Carte professionnelle N°:</Text>
              <TextInput style={styles.input} placeholder="Carte professionnelle N°" />
              <Text>Autorisation de circulation N°:</Text>
              <TextInput style={styles.input} placeholder="Autorisation de circulation N°" />
              <Text>Validité de l'autorisation:</Text>
              <TextInput style={styles.input} placeholder="Validité de l'autorisation" />
            </View>
            <View style={styles.btnContainer}>
              <Button title="Submit" onPress={() => null} />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
        justifyContent: 'center',
    },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  inner: {
    padding: 24,
    flexGrow: 1,
  },
  header: {
    fontSize: 36,
    marginBottom: 20,
    textAlign: 'center',
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
  dropdown: {
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 5,
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 1,
    width: '100%',
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Control;