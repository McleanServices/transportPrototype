import React, { useRef, useState, useEffect } from "react";
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
import { Asset } from 'expo-asset';
import { manipulateAsync } from 'expo-image-manipulator';
import { useStorageState } from '../../../context/useStorageState';
import { useLocalSearchParams } from 'expo-router';


const Control = () => {
  const asset = Asset.fromModule(require('../../../assets/images/logo.png'));

  const { control_id } = useLocalSearchParams();
  console.log('Local Search Params ID Control ID is:', control_id);

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

  const [storedNom] = useStorageState('nom');
  const [storedPrenom] = useStorageState('prenom');
  const [storedRole] = useStorageState('role');

  useEffect(() => {
    const [loading, nom] = storedNom || [false, null];
    const [loadingPrenom, prenom] = storedPrenom || [false, null];
    const [loadingRole, role] = storedRole || [false, null];
    console.log('Stored Nom:', !loading ? nom : 'loading...');
    console.log('Stored Prenom:', !loadingPrenom ? prenom : 'loading...');
    console.log('Stored Role:', !loadingRole ? role : 'loading...');

  }, [storedNom, storedPrenom, storedRole]);

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
    const image = await manipulateAsync(asset.localUri ?? asset.uri, [], { base64: true });
    const html = `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fiche de Signalment</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .header {
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
            border-bottom: 1px solid #ccc;
            font-size: 0.9em;
        }
        .left-section {
            float: left;
            width: 50%;
        }
        .left-section img {
            width: 100px;
            height: auto;
        }
        .left-section p {
            font-size: 0.8em;
            margin: 5px 0;
        }
        .right-section {
            float: right;
            width: 50%;
            text-align: right;
        }
        .upper-right {
            position: relative;
            top: 0;
            right: 0;
        }
        .aligned-text {
            background-color: blue;
            color: white;
            display: inline-block;
            padding: 2px 5px;
        }
        .bordered-div {
            border: 1px solid black;
            display: inline-block;
            position: relative;
            top: 60px;
        }
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9em;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        .info-section {
            margin: 10px 0;
        }
        .info-section p {
            margin: 3px 0;
        }
    </style>
</head>
<body>
    <div class="header clearfix">
        <div class="left-section">
            <img src="data:image/jpeg;base64,${image.base64}" alt="Logo">
            <p>DIRECTION TRANSPORT ET REGLEMENTATIONS</p>
            <p>SERVICE DES ACTIVITES REGLEMENTAIRES</p>
            <p>162A NRUE DE HOLLANDE</p>
            <p>97150 MARIGOT SAINT MARTIN</p>
            <p>TEL: 09901237645/069012769</p>
        </div>
        <div class="right-section">
            <div class="upper-right">
                COLLECTIVITE DE SAINT-MARTIN
                <h2 style="font-size: 0.8em;">UNITE CONTROLE ET VERIFICATION UCV</h2>
                <div class="bordered-div">
                    <p class="aligned-text">FICHE DE SIGNALMENT</p>
                </div>
            </div>
        </div>
    </div>
    
    <div class="info-section">
        <p>Station: ${station}</p>
        <p>Date: ${dateTime.toLocaleString()}</p>
        <p>Nom: ${storedNom?.[1] || ''} 
           Prenom: ${storedPrenom?.[1] || ''} 
           Poste occupe: ${storedRole?.[1] || ''}</p>
    </div>

    <table>
        <tbody>
            <tr>
                <td style="width: 50%;">Mise en cause</td>
                <td style="width: 50%;">Faute commise</td>
            </tr>
            <tr>
                <td style="width: 50%; vertical-align: top;" rowspan="2">
                    Nom: ${chauffeurNom}<br>
                    Prenom: ${chauffeurPrenom}<br>
                    Ne(e) le: ${dateNaissance}<br>
                    Lieu de naissance: ${lieuNaissance}<br>
                    Domicile: ${domicile}<br>
                    Occupation: ${occupation}<br>
                    <div>Observations: ${observation}</div>
                </td>
                <td style="width: 50%;">${selectedFaults.join('<br>')}</td>
            </tr>
            <tr>
                <td style="width: 50%;">Personne informée de l'incident:</td>
            </tr>
        </tbody>
    </table>

    <table>
        <tbody>
            <tr>
                <td style="width: 50%; text-align: center;">
                    <div>Visa de(s)</div>
                    <p><br></p>
                </td>
                <td style="width: 50%; text-align: center;">
                    <div>Visa du N + 1</div>
                    <p><br></p>
                </td>
            </tr>
        </tbody>
    </table>

    <table>
        <tbody>
            <tr>
                <td style="width: 50%; text-align: center;">
                    <div>Visa Chef de Service</div>
                    <div>Activite Regelementes</div>
                    <p><br></p>
                </td>
                <td style="width: 50%; text-align: center;">
                    <div>Visa de la Directrice</div>
                    <div>Transport et Regelementations</div>
                    <p><br></p>
                </td>
            </tr>
        </tbody>
    </table>
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
                justifyContent: "center", // Add this
                padding: 10,
                width: "100%", // Add this
              }}
            >
              <Image
                source={require("../../../assets/images/logo.png")}
                style={{ width: 100, height: 70, marginRight: 20 }} // Reduced marginRight
              />
              <View style={{
                alignItems: "center",
                flex: 1, // Add this
                maxWidth: "70%" // Add this to prevent text from stretching too wide
              }}>
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: "green", textAlign: "center" }}
                >
                  Fiche d'Information – Unité Contrôle et Vérification (UCV)
                </Text>
                <Text style={{ fontSize: 18, textAlign: "center" }}>
                  DIRECTION TRANSPORT ET REGLEMENTATIONS – Service des Activités
                  Règlementées
                </Text>
                <Text style={{ fontSize: 16, textAlign: "center" }}>
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
              <View style={styles.input}>
                <Text>{storedNom?.[1] || ''}</Text>
              </View>
              <Text>Prénom:</Text>
              <View style={styles.input}>
                <Text>{storedPrenom?.[1] || ''}</Text>
              </View>
              <Text>Role:</Text>
              <View style={styles.input}>
                <Text>{storedRole?.[1] || ''}</Text>
              </View>
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
