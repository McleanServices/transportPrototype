import React, { useRef, useState } from "react";
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
} from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import FaultsModal from "../../../components/FaultsModal";
import StationModal from "../../../components/StationModal";

const Control = () => {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [dateTime, setDateTime] = useState(new Date());
  const [station, setStation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [showStationDropdown, setShowStationDropdown] = useState(false);
  const [showOccupationDropdown, setShowOccupationDropdown] = useState(false);
  const [assistants, setAssistants] = useState([{ nom: "", prenom: "" }]);
  const [chauffeurNom, setChauffeurNom] = useState("");
  const [chauffeurPrenom, setChauffeurPrenom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [lieuNaissance, setLieuNaissance] = useState("");
  const [domicile, setDomicile] = useState("");
  const [documentReleve, setDocumentReleve] = useState("");
  const [carteProNum, setCarteProNum] = useState("");
  const [autorisationNum, setAutorisationNum] = useState("");
  const [validiteAutorisation, setValiditeAutorisation] = useState("");
  const [observation, setObservation] = useState("");
  const [faultsModalVisible, setFaultsModalVisible] = useState(false);
  const [selectedFaults, setSelectedFaults] = useState<string[]>([]);
  const [stationModalVisible, setStationModalVisible] = useState(false);
  const [taxiNumero, setTaxiNumero] = useState("");
  const [immatriculation, setImmatriculation] = useState("");
  const [typeMarque, setTypeMarque] = useState("");
  const [couleurVehicule, setCouleurVehicule] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");

  const stations = ["Marigot", "Grand Case"];
  const occupations = ["Taxi Driver", "Transport Operator"];

  const addAssistant = () => {
    setAssistants([...assistants, { nom: "", prenom: "" }]);
  };

  const updateAssistant = (
    index: number,
    field: "nom" | "prenom",
    value: string
  ) => {
    const newAssistants = [...assistants];
    newAssistants[index][field] = value;
    setAssistants(newAssistants);
  };

  const removeAssistant = (index: number) => {
    const newAssistants = assistants.filter((_, i) => i !== index);
    setAssistants(newAssistants);
  };

  const printToFile = async () => {
    const html = `
      <!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fiche d’Information</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      padding: 20px;
      border: 1px solid #000;
    }
    h1, h2 {
      text-align: center;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
    }
    .section {
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <h1>Fiche d’Information – Unité Contrôle et Vérification (UCV)</h1>
  <p><strong>Date:</strong> ${dateTime.toLocaleString()}</p>
  <p><strong>Station:</strong> ${station}</p>

  <div class="section">
    <table>
      <tr><td><strong>Nom:</strong></td><td>${nom}</td></tr>
      <tr><td><strong>Prénom:</strong></td><td>${prenom}</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Assistants</h2>
    <table>
      <tr><th>Nom</th><th>Prénom</th></tr>
      ${assistants
        .map(
          (assistant) =>
            `<tr><td>${assistant.nom}</td><td>${assistant.prenom}</td></tr>`
        )
        .join("")}
    </table>
  </div>

  <div class="section">
    <h2>Mise en Cause</h2>
    <table>
      <tr><td><strong>Nom:</strong></td><td>${chauffeurNom}</td></tr>
      <tr><td><strong>Prénom:</strong></td><td>${chauffeurPrenom}</td></tr>
      <tr><td><strong>Né(e) le:</strong></td><td>${dateNaissance}</td></tr>
      <tr><td><strong>Lieu de Naissance:</strong></td><td>${lieuNaissance}</td></tr>
      <tr><td><strong>Domicile:</strong></td><td>${domicile}</td></tr>
      <tr><td><strong>Occupation:</strong></td><td>${occupation}</td></tr>
      <tr><td><strong>Document relevé:</strong></td><td>${documentReleve}</td></tr>
      <tr><td><strong>Carte professionnelle N°:</strong></td><td>${carteProNum}</td></tr>
      <tr><td><strong>Autorisation de circulation N°:</strong></td><td>${autorisationNum}</td></tr>
      <tr><td><strong>Validité de l’autorisation:</strong></td><td>${validiteAutorisation}</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Faute(s) commise(s)</h2>
    <ul>
      ${selectedFaults.map((fault) => `<li>${fault}</li>`).join("")}
    </ul>
  </div>

  <div class="section">
    <h2>Observations</h2>
    <p>${observation}</p>
  </div>

  <div class="section">
    <h2>Informations du Véhicule</h2>
    <table>
      <tr><td><strong>Taxi numéro:</strong></td><td>${taxiNumero}</td></tr>
      <tr><td><strong>Immatriculation:</strong></td><td>${immatriculation}</td></tr>
      <tr><td><strong>Type et Marque:</strong></td><td>${typeMarque}</td></tr>
      <tr><td><strong>Couleur du véhicule:</strong></td><td>${couleurVehicule}</td></tr>
    </table>
  </div>
</body>
</html>

    `;
    const { uri } = await Print.printToFileAsync({ html });
    console.log("File has been saved to:", uri);
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
              }}
            >
              <Image
                source={require("../../../assets/images/logo.png")}
                style={{ width: 100, height: 70, marginRight: 130 }}
              />
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: "green" }}
                >
                  Fiche d’Information – Unité Contrôle et Vérification (UCV)
                </Text>
                <Text style={{ fontSize: 18 }}>
                  DIRECTION TRANSPORT ET REGLEMENTATIONS – Service des Activités
                  Règlementées
                </Text>
                <Text style={{ fontSize: 16 }}>
                  {dateTime.toLocaleString()}
                </Text>
              </View>
            </View>
            <View style={{ padding: 10 }}>
              <Text style={styles.heading}>Station de Taxi:</Text>
              <TouchableOpacity
                onPress={() => setStationModalVisible(true)}
                style={styles.input}
              >
                <Text>{station || "Select Station"}</Text>
              </TouchableOpacity>
              <StationModal
                modalVisible={stationModalVisible}
                setModalVisible={setStationModalVisible}
                selectedStation={station}
                setSelectedStation={setStation}
              />
            </View>
            <View style={{ padding: 10 }}>
              <Text>Nom:</Text>
               <TextInput
                style={styles.input}
                placeholder="Nom"
                value={nom}
                onChangeText={setNom}
              />
              <Text>Prénom:</Text>
              <TextInput
                style={styles.input}
                placeholder="Prénom"
                value={prenom}
                onChangeText={setPrenom}
              />
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
                    onChangeText={(text) => updateAssistant(index, "nom", text)}
                  />
                  <Text>Prénom:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Prénom"
                    value={assistant.prenom}
                    onChangeText={(text) =>
                      updateAssistant(index, "prenom", text)
                    }
                  />
                  <Button
                    title="Remove Assistant"
                    onPress={() => removeAssistant(index)}
                  />
                </View>
              ))}
              <Button title="Add Assistant" onPress={addAssistant} />
            </View>
            <View style={{ padding: 10 }}>
              <Text style={styles.heading}>Mise en Cause</Text>
              <Text>Nom du Chauffeur:</Text>
              <TextInput
                style={styles.input}
                placeholder="Nom"
                value={chauffeurNom}
                onChangeText={setChauffeurNom}
              />
              <Text>Prénom:</Text>
              <TextInput
                style={styles.input}
                placeholder="Prénom"
                value={chauffeurPrenom}
                onChangeText={setChauffeurPrenom}
              />
              <Text>Né(e) le:</Text>
              <TextInput
                style={styles.input}
                placeholder="Date de Naissance"
                value={dateNaissance}
                onChangeText={setDateNaissance}
              />
              <Text>Lieu de Naissance:</Text>
              <TextInput
                style={styles.input}
                placeholder="Lieu de Naissance"
                value={lieuNaissance}
                onChangeText={setLieuNaissance}
              />
              <Text>Domicile:</Text>
              <TextInput
                style={styles.input}
                placeholder="Domicile"
                value={domicile}
                onChangeText={setDomicile}
              />
              <Text>Occupation:</Text>
              <TextInput
                style={styles.input}
                placeholder="Occupation"
                value={occupation}
                onChangeText={setOccupation}
              />
              <Text>Document releve:</Text>
              <TextInput
                style={styles.input}
                placeholder="Document releve"
                value={documentReleve}
                onChangeText={setDocumentReleve}
              />
              <Text>Carte professionnelle N°:</Text>
              <TextInput
                style={styles.input}
                placeholder="Carte professionnelle N°"
                value={carteProNum}
                onChangeText={setCarteProNum}
              />
              <Text>Autorisation de circulation N°:</Text>
              <TextInput
                style={styles.input}
                placeholder="Autorisation de circulation N°"
                value={autorisationNum}
                onChangeText={setAutorisationNum}
              />
              <Text>
                Avis sur demande de changement de vehicule date de validité:
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Validité de l'autorisation"
                value={validiteAutorisation}
                onChangeText={setValiditeAutorisation}
              />
            </View>
            <View style={{ padding: 10 }}>
              <Text style={styles.heading}>Observation:</Text>
              <TextInput
                style={styles.input}
                placeholder="Observation"
                value={observation}
                onChangeText={setObservation}
              />
              <Text>Taxi numero:</Text>
              <TextInput
                style={styles.input}
                placeholder="Taxi numero"
                value={taxiNumero}
                onChangeText={setTaxiNumero}
              />
              <Text>Immatriculation:</Text>
              <TextInput
                style={styles.input}
                placeholder="Immatriculation"
                value={immatriculation}
                onChangeText={setImmatriculation}
              />
              <Text>Type et Marque:</Text>
              <TextInput
                style={styles.input}
                placeholder="Type et Marque"
                value={typeMarque}
                onChangeText={setTypeMarque}
              />
              <Text>Couleur de vehicule:</Text>
              <TextInput
                style={styles.input}
                placeholder="Couleur de vehicule"
                value={couleurVehicule}
                onChangeText={setCouleurVehicule}
              />
            </View>
            <View style={{ padding: 10 }}>
              <Text style={styles.heading}>Faute(s) commise(s):</Text>
              <TouchableOpacity
                onPress={() => setFaultsModalVisible(true)}
                style={styles.input}
              >
                <Text>Select Faults</Text>
              </TouchableOpacity>
              <FaultsModal
                modalVisible={faultsModalVisible}
                setModalVisible={setFaultsModalVisible}
                selectedFaults={selectedFaults}
                setSelectedFaults={setSelectedFaults}
              />
              {selectedFaults.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  {selectedFaults.map((fault, index) => (
                    <Text key={index} style={styles.selectedFaultText}>
                      {fault}
                    </Text>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.btnContainer}>
              <Button title="Submit" onPress={() => null} />
              <Button title="Print to PDF file" onPress={printToFile} />
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
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    justifyContent: "center",
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
    textAlign: "center",
  },
  textInput: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
  dropdown: {
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 5,
    backgroundColor: "white",
    position: "absolute",
    zIndex: 1,
    width: "100%",
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  selectedFaultText: {
    fontSize: 16,
    color: "blue",
  },
});

export default Control;
