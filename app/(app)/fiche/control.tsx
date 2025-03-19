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
import FaultsModal from "../../../components/modals/FaultsModal";
import StationModal from "../../../components/modals/StationModal";
import { Asset } from "expo-asset";
import { manipulateAsync } from "expo-image-manipulator";
import { useStorageState } from "../../../context/useStorageState";
import { useLocalSearchParams } from "expo-router";
import ucvFormService, { UCVFormData } from "../../model/ucvformService";
import { SQLiteProvider } from "expo-sqlite";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Control() {
  
  const asset = Asset.fromModule(require("../../../assets/images/logo.png"));

  const { airport_taxi_rotation_id } = useLocalSearchParams();
  const { type} = useLocalSearchParams();
  console.log(
    "Local Search Params ID Control ID is:",
    airport_taxi_rotation_id,
    "Type is:",
    type
  );

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

  const [storedNom] = useStorageState("nom");
  const [storedPrenom] = useStorageState("prenom");
  const [storedRole] = useStorageState("role");
  const [formExists, setFormExists] = useState(false);

  useEffect(() => {
    const [loading, nom] = storedNom || [false, null];
    const [loadingPrenom, prenom] = storedPrenom || [false, null];
    const [loadingRole, role] = storedRole || [false, null];
    console.log("Stored Nom:", !loading ? nom : "loading...");
    console.log("Stored Prenom:", !loadingPrenom ? prenom : "loading...");
    console.log("Stored Role:", !loadingRole ? role : "loading...");
  }, [storedNom, storedPrenom, storedRole]);

  useEffect(() => {
    let isMounted = true;

    const initDB = async () => {
      try {
        await ucvFormService.initDatabase();
        console.log("Database initialized successfully");
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };

    initDB();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const checkExistingForm = async () => {
      if (!airport_taxi_rotation_id && !type) return;

      try {
        const storedRotationId = await AsyncStorage.getItem('airport_taxi_rotation_id');
        const storedType = await AsyncStorage.getItem('type');

        if (storedRotationId === String(airport_taxi_rotation_id) && storedType === String(type)) {
          await AsyncStorage.clear();
          setFormExists(false);
          return;
        }

        await AsyncStorage.setItem('airport_taxi_rotation_id', String(airport_taxi_rotation_id));
        await AsyncStorage.setItem('type', String(type));

        console.log("Checking if form exists for rotation ID:", airport_taxi_rotation_id);
        const exists = await ucvFormService.checkFormExists(Number(airport_taxi_rotation_id), String(type));
        setFormExists(exists);

        if (exists) {
          const formData = await ucvFormService.getFormByRotationId(Number(airport_taxi_rotation_id));
          if (formData) {
            setStation(formData.station || "");
            setChauffeurNom(formData.chauffeur_nom || "");
            setChauffeurPrenom(formData.chauffeur_prenom || "");
            setDateNaissance(formData.date_naissance || "");
            setLieuNaissance(formData.lieu_naissance || "");
            setDomicile(formData.domicile || "");
            setOccupation(formData.occupation || "");
            setDocumentReleve(formData.document_releve || "");
            setCarteProNum(formData.carte_pro_num || "");
            setAutorisationNum(formData.autorisation_num || "");
            setValiditeAutorisation(formData.validite_autorisation || "");
            setObservation(formData.observation || "");
            setTaxiNumero(formData.taxi_numero || "");
            setImmatriculation(formData.immatriculation || "");
            setTypeMarque(formData.type_marque || "");
            setCouleurVehicule(formData.couleur_vehicule || "");
          }
          alert("Form data loaded for this rotation ID. Form is in read-only mode.");
        }
      } catch (error) {
        console.error("Error checking existing form:", error);
      }
    };

    checkExistingForm();
  }, [airport_taxi_rotation_id, type]);

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
    const image = await manipulateAsync(asset.localUri ?? asset.uri, [], {
      base64: true,
    });
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
        <p>Nom: ${storedNom?.[1] || ""} 
           Prenom: ${storedPrenom?.[1] || ""} 
           Poste occupe: ${storedRole?.[1] || ""}</p>
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
                <td style="width: 50%;">${selectedFaults.join("<br>")}</td>
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

  const handleSubmit = async () => {
    try {
      const formData: UCVFormData = {
        airprt_taxi_rotation_id: Number(airport_taxi_rotation_id),
        type: String(type),
        station: station,
        nom: storedNom?.[1] || "",
        prenom: storedPrenom?.[1] || "",
        role: storedRole?.[1] || "",
        chauffeur_nom: chauffeurNom,
        chauffeur_prenom: chauffeurPrenom,
        date_naissance: dateNaissance,
        lieu_naissance: lieuNaissance,
        domicile: domicile,
        occupation: occupation,
        document_releve: documentReleve,
        carte_pro_num: carteProNum,
        autorisation_num: autorisationNum,
        validite_autorisation: validiteAutorisation,
        observation: observation,
        taxi_numero: taxiNumero,
        immatriculation: immatriculation,
        type_marque: typeMarque,
        couleur_vehicule: couleurVehicule,
      };

      const id = await ucvFormService.create(formData);
      console.log("Created UCV form with ID:", id);
      await ucvFormService.getAllForms();
      alert("Form submitted successfully!");
      setFormExists(true); // Set form as existing after successful submission
    } catch (error) {
      console.error("Error creating UCV form:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  return (
    <SQLiteProvider databaseName="transport.db">
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
              {/* Header Section */}
              <View style={styles.headerContainer}>
                <Image
                  source={require("../../../assets/images/logo.png")}
                  style={styles.logo}
                />
                <View style={styles.headerTextContainer}>
                  <Text style={styles.headerTitle}>
                    Fiche d'Information – Unité Contrôle et Vérification (UCV)
                  </Text>
                  <Text style={styles.headerSubtitle}>
                    DIRECTION TRANSPORT ET REGLEMENTATIONS – Service des Activités
                    Règlementées
                  </Text>
                  <Text style={styles.headerDate}>{dateTime.toLocaleString()}</Text>
                </View>
              </View>
  
              {/* Station de Taxi Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Station de Taxi:</Text>
                <TouchableOpacity
                  onPress={() => setStationModalVisible(true)}
                  style={styles.input}
                >
                  <Text style={styles.inputText}>{station || "Select Station"}</Text>
                </TouchableOpacity>
                <StationModal
                  modalVisible={stationModalVisible}
                  setModalVisible={setStationModalVisible}
                  selectedStation={station}
                  setSelectedStation={setStation}
                />
              </View>
  
              {/* User Information Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informations Personnelles:</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nom:</Text>
                  <View style={styles.input}>
                    <Text style={styles.inputText}>{storedNom?.[1] || ""}</Text>
                  </View>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Prénom:</Text>
                  <View style={styles.input}>
                    <Text style={styles.inputText}>{storedPrenom?.[1] || ""}</Text>
                  </View>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Role:</Text>
                  <View style={styles.input}>
                    <Text style={styles.inputText}>{storedRole?.[1] || ""}</Text>
                  </View>
                </View>
              </View>
  
              {/* Assistants Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Assistants (if any)</Text>
                {assistants.map((assistant, index) => (
                  <View key={index} style={styles.assistantContainer}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Nom:</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Nom"
                        value={assistant.nom}
                        onChangeText={(text) => updateAssistant(index, "nom", text)}
                        editable={!formExists}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Prénom:</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Prénom"
                        value={assistant.prenom}
                        onChangeText={(text) => updateAssistant(index, "prenom", text)}
                        editable={!formExists}
                      />
                    </View>
                    <Button
                      title="Remove Assistant"
                      onPress={() => removeAssistant(index)}
                      disabled={formExists}
                      color="#ff4444"
                    />
                  </View>
                ))}
                <Button
                  title="Add Assistant"
                  onPress={addAssistant}
                  disabled={formExists}
                  color="#4CAF50"
                />
              </View>
  
              {/* Mise en Cause Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mise en Cause</Text>
                {[
                  { label: "Nom du Chauffeur:", value: chauffeurNom, setter: setChauffeurNom },
                  { label: "Prénom:", value: chauffeurPrenom, setter: setChauffeurPrenom },
                  { label: "Né(e) le:", value: dateNaissance, setter: setDateNaissance },
                  { label: "Lieu de Naissance:", value: lieuNaissance, setter: setLieuNaissance },
                  { label: "Domicile:", value: domicile, setter: setDomicile },
                  { label: "Occupation:", value: occupation, setter: setOccupation },
                  { label: "Document relevé:", value: documentReleve, setter: setDocumentReleve },
                  { label: "Carte professionnelle N°:", value: carteProNum, setter: setCarteProNum },
                  { label: "Autorisation de circulation N°:", value: autorisationNum, setter: setAutorisationNum },
                  { label: "Validité de l'autorisation:", value: validiteAutorisation, setter: setValiditeAutorisation },
                ].map((field, index) => (
                  <View key={index} style={styles.inputGroup}>
                    <Text style={styles.label}>{field.label}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={field.label}
                      value={field.value}
                      onChangeText={field.setter}
                      editable={!formExists}
                    />
                  </View>
                ))}
              </View>
  
              {/* Observation Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Observation:</Text>
                {[
                  { label: "Observation:", value: observation, setter: setObservation },
                  { label: "Taxi numero:", value: taxiNumero, setter: setTaxiNumero },
                  { label: "Immatriculation:", value: immatriculation, setter: setImmatriculation },
                  { label: "Type et Marque:", value: typeMarque, setter: setTypeMarque },
                  { label: "Couleur de vehicule:", value: couleurVehicule, setter: setCouleurVehicule },
                ].map((field, index) => (
                  <View key={index} style={styles.inputGroup}>
                    <Text style={styles.label}>{field.label}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={field.label}
                      value={field.value}
                      onChangeText={field.setter}
                      editable={!formExists}
                    />
                  </View>
                ))}
              </View>
  
              {/* Faults Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Faute(s) commise(s):</Text>
                <TouchableOpacity
                  onPress={() => setFaultsModalVisible(true)}
                  style={styles.input}
                  disabled={formExists}
                >
                  <Text style={styles.inputText}>Select Faults</Text>
                </TouchableOpacity>
                <FaultsModal
                  modalVisible={faultsModalVisible}
                  setModalVisible={setFaultsModalVisible}
                  selectedFaults={selectedFaults}
                  setSelectedFaults={setSelectedFaults}
                />
                {selectedFaults.length > 0 && (
                  <View style={styles.selectedFaultsContainer}>
                    {selectedFaults.map((fault, index) => (
                      <Text key={index} style={styles.selectedFaultText}>
                        {fault}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
  
              {/* Buttons Section */}
              <View style={styles.buttonContainer}>
                <Button
                  title={formExists ? "Form Already Exists" : "Submit"}
                  onPress={handleSubmit}
                  disabled={formExists}
                  color="#4CAF50"
                />
                <Button title="Print to PDF file" onPress={printToFile} color="#2196F3" />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SQLiteProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  inner: {
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 56,
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 12,
    color: "#999",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  inputText: {
    fontSize: 14,
    color: "#333",
  },
  assistantContainer: {
    marginBottom: 16,
  },
  selectedFaultsContainer: {
    marginTop: 12,
  },
  selectedFaultText: {
    fontSize: 14,
    color: "#2196F3",
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});


//TODO: Add missing input for personne informe de l'incident(update sql services too)
//TODO: Add missing codes cival to the pdf
//TODO: Automatically disabling submit button it after clicking it
//TODO: clean up pdf file text grammar/spelling mistakes etc..
