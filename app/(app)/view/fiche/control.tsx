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
import FaultsModal from "../../../../components/modals/FaultsModal";
import StationModal from "../../../../components/modals/StationModal";
import { Asset } from "expo-asset";
import { manipulateAsync } from "expo-image-manipulator";
import { useStorageState } from "../../../../context/useStorageState";
import { useLocalSearchParams } from "expo-router";
import ucvFormService, { UCVFormData } from "../../model/ucvformService";
import { SQLiteProvider } from "expo-sqlite";
import AsyncStorage from '@react-native-async-storage/async-storage';


// Helper: Save step data to AsyncStorage
interface StepData0 {
  station: string;
  storedNom: string;
  storedPrenom: string;
  storedRole: string;
}

interface Assistant {
  nom: string;
  prenom: string;
}

interface StepData1 {
  assistants: Assistant[];
}

interface StepData2 {
  chauffeurNom: string;
  chauffeurPrenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  domicile: string;
  occupation: string;
  documentReleve: string;
  carteProNum: string;
  autorisationNum: string;
  validiteAutorisation: string;
}

interface CustomFault {
  fault: string;
}

interface StepData3 {
  observation: string;
  taxiNumero: string;
  immatriculation: string;
  typeMarque: string;
  couleurVehicule: string;
  selectedFaults: string[];
  customFaults: CustomFault[];
}

type StepData = StepData0 | StepData1 | StepData2 | StepData3;

const saveStepData = async (step: number, data: StepData): Promise<void> => {
  try {
    await AsyncStorage.setItem(`fiche_step_${step}`, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save step data", step, e);
  }
};

// Helper: Load all step data for review
const loadAllStepData = async () => {
  const keys = [
    "fiche_step_0",
    "fiche_step_1",
    "fiche_step_2",
    "fiche_step_3"
  ];
  const result: { [key: string]: any } = {};
  for (const key of keys) {
    try {
      const val = await AsyncStorage.getItem(key);
      if (val) result[key] = JSON.parse(val);
    } catch {}
  }
  return result;
};

export default function Control() {
  const asset = Asset.fromModule(require("../../../../assets/images/logo.png"));

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
  const [customFaults, setCustomFaults] = useState([{ fault: "" }]);

  const [storedNom] = useStorageState("nom");
  const [storedPrenom] = useStorageState("prenom");
  const [storedRole] = useStorageState("role");
  const [formExists, setFormExists] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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

  const addCustomFault = () => {
    setCustomFaults([...customFaults, { fault: "" }]);
  };

  const updateCustomFault = (index: number, value: string) => {
    const newCustomFaults = [...customFaults];
    newCustomFaults[index].fault = value;
    setCustomFaults(newCustomFaults);
  };

  const removeCustomFault = (index: number) => {
    const newCustomFaults = customFaults.filter((_, i) => i !== index);
    setCustomFaults(newCustomFaults);
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

  // Steps definition (add Review step before Download PDF)
  const steps = [
    { label: "Station & User", key: "station" },
    { label: "Assistants", key: "assistants" },
    { label: "Mise en Cause", key: "miseEnCause" },
    { label: "Faults & Observations", key: "faults" },
    { label: "Review", key: "review" },
    { label: "Download PDF", key: "download" },
  ];

  // Navigation handlers
  const nextStep = async () => {
    if (currentStep === 0) {
      await saveStepData(0, {
        station,
        storedNom: storedNom?.[1] || "",
        storedPrenom: storedPrenom?.[1] || "",
        storedRole: storedRole?.[1] || ""
      });
    }
    if (currentStep === 1) {
      await saveStepData(1, { assistants });
    }
    if (currentStep === 2) {
      await saveStepData(2, {
        chauffeurNom, chauffeurPrenom, dateNaissance, lieuNaissance,
        domicile, occupation, documentReleve, carteProNum,
        autorisationNum, validiteAutorisation
      });
    }
    if (currentStep === 3) {
      await saveStepData(3, {
        observation, taxiNumero, immatriculation, typeMarque,
        couleurVehicule, selectedFaults, customFaults
      });
    }
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  // Step bar component
  const StepBar = () => (
    <View style={styles.stepBarContainer}>
      {steps.map((step, idx) => (
        <View key={step.key} style={styles.stepBarStep}>
          <View
            style={[
              styles.stepCircle,
              currentStep === idx && styles.stepCircleActive,
              idx < currentStep && styles.stepCircleCompleted,
            ]}
          >
            <Text style={styles.stepNumber}>{idx + 1}</Text>
          </View>
          <Text
            style={[
              styles.stepLabel,
              currentStep === idx && styles.stepLabelActive,
            ]}
          >
            {step.label}
          </Text>
          {idx < steps.length - 1 && <View style={styles.stepBarLine} />}
        </View>
      ))}
    </View>
  );

  // Step content
  const [reviewData, setReviewData] = useState<{ [key: string]: any } | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    if (currentStep === 4) {
      setReviewLoading(true);
      loadAllStepData().then(data => {
        setReviewData(data);
        setReviewLoading(false);
      });
    }
  }, [currentStep]);

  const renderStep = () => {
    // Header for each step: only title and date/time
    const StepHeader = () => (
      <View style={styles.headerContainerSimple}>
        <Text style={styles.headerTitle}>Fiche d'Information</Text>
        <Text style={styles.headerDate}>{dateTime.toLocaleString()}</Text>
      </View>
    );

    switch (currentStep) {
      case 0:
        return (
          <>
            <StepHeader />
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
          </>
        );
      case 1:
        return (
          <>
            <StepHeader />
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
          </>
        );
      case 2:
        return (
          <>
            <StepHeader />
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
          </>
        );
      case 3:
        return (
          <>
            <StepHeader />
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
              <Text style={styles.sectionTitle}>Autres Faute(s):</Text>
              {customFaults.map((customFault, index) => (
                <View key={index} style={styles.inputGroup}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter custom fault"
                    value={customFault.fault}
                    onChangeText={(text) => updateCustomFault(index, text)}
                    editable={!formExists}
                  />
                  <Button
                    title="Remove"
                    onPress={() => removeCustomFault(index)}
                    disabled={formExists}
                    color="#ff4444"
                  />
                </View>
              ))}
              <Button
                title="Add Custom Fault"
                onPress={addCustomFault}
                disabled={formExists}
                color="#4CAF50"
              />
            </View>
          </>
        );
      case 4:
        return (
          <>
            <StepHeader />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vérification des informations</Text>
              {reviewLoading ? (
                <Text>Chargement...</Text>
              ) : reviewData ? (
                <>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Station de Taxi:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_0?.station || ""}</Text>
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Nom:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_0?.storedNom || ""}</Text>
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Prénom:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_0?.storedPrenom || ""}</Text>
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Role:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_0?.storedRole || ""}</Text>
                  </View>
                  {reviewData.fiche_step_1?.assistants?.length > 0 && (
                    <View style={styles.reviewGroup}>
                      <Text style={styles.reviewLabel}>Assistants:</Text>
                      {reviewData.fiche_step_1.assistants.map(
                      (a: { nom: string; prenom: string }, i: number) => (
                        <Text key={i} style={styles.reviewValue}>
                        {a.nom} {a.prenom}
                        </Text>
                      )
                      )}
                    </View>
                  )}
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Nom du Chauffeur:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_2?.chauffeurNom || ""}</Text>
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Prénom du Chauffeur:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_2?.chauffeurPrenom || ""}</Text>
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Né(e) le:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_2?.dateNaissance || ""}</Text>
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Lieu de Naissance:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_2?.lieuNaissance || ""}</Text>
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Domicile:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_2?.domicile || ""}</Text>
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Occupation:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_2?.occupation || ""}</Text>
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Document relevé:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_2?.documentReleve || ""}</Text>
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Carte professionnelle N°:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_2?.carteProNum || ""}</Text>
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Autorisation de circulation N°:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_2?.autorisationNum || ""}</Text>
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Validité de l'autorisation:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_2?.validiteAutorisation || ""}</Text>
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Observation:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_3?.observation || ""}</Text>
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Taxi numero:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_3?.taxiNumero || ""}</Text>
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Immatriculation:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_3?.immatriculation || ""}</Text>
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Type et Marque:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_3?.typeMarque || ""}</Text>
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Couleur de véhicule:</Text>
                    <Text style={styles.reviewValue}>{reviewData.fiche_step_3?.couleurVehicule || ""}</Text>
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Fautes commises:</Text>
                    {reviewData.fiche_step_3?.selectedFaults?.length > 0 ? (
                      reviewData.fiche_step_3.selectedFaults.map(
                        (fault: string, i: number): React.ReactNode => (
                          <Text key={i} style={styles.reviewValue}>{fault}</Text>
                        )
                      )
                    ) : (
                      <Text style={styles.reviewValue}>Aucune</Text>
                    )}
                  </View>
                  <View style={styles.reviewGroup}>
                    <Text style={styles.reviewLabel}>Autres fautes:</Text>
                    {reviewData.fiche_step_3?.customFaults?.length > 0 ? (
                      reviewData.fiche_step_3.customFaults.map(
                        (f: { fault: string }, i: number): React.ReactNode =>
                          f.fault ? (
                            <Text key={i} style={styles.reviewValue}>{f.fault}</Text>
                          ) : null
                      )
                    ) : (
                      <Text style={styles.reviewValue}>Aucune</Text>
                    )}
                  </View>
                </>
              ) : null}
            </View>
          </>
        );
      case 5:
        return (
          <>
            <StepHeader />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Télécharger le PDF</Text>
              <Button title="Print to PDF file" onPress={printToFile} color="#2196F3" />
              <Button
                title={formExists ? "Form Already Exists" : "Submit"}
                onPress={handleSubmit}
                disabled={formExists}
                color="#4CAF50"
              />
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SQLiteProvider databaseName="transport.db">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <View style={styles.multiStepRoot}>
          <StepBar />
          <View style={styles.scrollViewWrapper}>
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={[
                styles.scrollContainer,
                currentStep === 4 && { paddingBottom: 30 }
              ]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              alwaysBounceVertical={true}
              bounces={true}
              contentInsetAdjustmentBehavior="automatic"
              style={styles.stepContent}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                  {renderStep()}
                  <View style={styles.stepNavContainer}>
                    {currentStep > 0 && (
                      <Button title="Back" onPress={prevStep} color="#888" />
                    )}
                    {currentStep < steps.length - 1 && (
                      <Button title="Next" onPress={nextStep} color="#2196F3" />
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SQLiteProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollViewWrapper: {
    flex: 1,
    flexGrow: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  inner: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerContainerSimple: {
    marginBottom: 24,
    alignItems: "flex-start",
    paddingHorizontal: 0,
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
    width: '100%',
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
  multiStepRoot: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
  },
  stepBarContainer: {
    width: 120,
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#f0f0f0",
  },
  stepBarStep: {
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stepCircleActive: {
    backgroundColor: "#2196F3",
  },
  stepCircleCompleted: {
    backgroundColor: "#4CAF50",
  },
  stepNumber: {
    color: "#fff",
    fontWeight: "bold",
  },
  stepLabel: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
  stepLabelActive: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  stepBarLine: {
    width: 2,
    height: 24,
    backgroundColor: "#ccc",
    alignSelf: "center",
  },
  stepContent: {
    flex: 1,
    paddingLeft: 0,
    width: '100%',
  },
  stepNavContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  reviewGroup: {
    marginBottom: 10,
    paddingRight: 10,
    width: '100%',
  },
  reviewLabel: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 15,
  },
  reviewValue: {
    color: "#444",
    fontSize: 15,
    marginLeft: 8,
    marginBottom: 2,
  },
});


//TODO: Add missing input for personne informe de l'incident(update sql services too)
//TODO: Add missing codes cival to the pdf
//TODO: Automatically disabling submit button it after clicking it
//TODO: clean up pdf file text grammar/spelling mistakes etc..
