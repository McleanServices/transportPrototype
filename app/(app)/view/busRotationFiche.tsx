import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import Slider from "@react-native-community/slider";

// Mock data
const initialData = [
  {
    bus_rotation_id: 1,
    exploitants: "BUS-001",
    arrival_time: "2025-07-16T08:30:00",
    departure_time: "2025-07-16T09:00:00",
    passenger_count: 20,
    observations: "On time",
  },
  {
    bus_rotation_id: 2,
    exploitants: "BUS-002",
    arrival_time: "2025-07-16T09:15:00",
    departure_time: "2025-07-16T09:45:00",
    passenger_count: 15,
    observations: "Delayed",
  },
  {
    bus_rotation_id: 3,
    exploitants: "BUS-003",
    arrival_time: "2025-07-16T10:00:00",
    departure_time: "2025-07-16T10:30:00",
    passenger_count: 18,
    observations: "",
  },
];

// Mock exploitants data
const exploitantsOptions = [
  { label: "BUS-001", value: "BUS-001" },
  { label: "BUS-002", value: "BUS-002" },
  { label: "BUS-003", value: "BUS-003" },
  { label: "BUS-004", value: "BUS-004" },
  { label: "BUS-005", value: "BUS-005" },
];

// Map exploitants to passenger capacity
const exploitantsCapacity: Record<string, number> = {
  "BUS-001": 20,
  "BUS-002": 20,
  "BUS-003": 20,
  "BUS-004": 12,
  "BUS-005": 12,
};

const observationKeywords = [
  "RAS",
  "En retard",
  "Annulé",
  "Complet",
  "Incident technique",
];

export default function BusRotationFiche() {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [mockData, setMockData] = useState(initialData);

  // Form state
  const [exploitants, setExploitants] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [passengerCount, setPassengerCount] = useState("");
  const [observations, setObservations] = useState("");

  // Edit form state
  const [editExploitants, setEditExploitants] = useState("");
  const [editArrivalTime, setEditArrivalTime] = useState("");
  const [editDepartureTime, setEditDepartureTime] = useState("");
  const [editPassengerCount, setEditPassengerCount] = useState("");
  const [editObservations, setEditObservations] = useState("");

  // DateTimePicker visibility states
  const [showArrivalPicker, setShowArrivalPicker] = useState(false);
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showEditArrivalPicker, setShowEditArrivalPicker] = useState(false);
  const [showEditDeparturePicker, setShowEditDeparturePicker] = useState(false);

  const todayDate = new Date().toLocaleDateString("fr-FR");

  const handleAddData = () => {
    if (arrivalTime && departureTime && new Date(departureTime) < new Date(arrivalTime)) {
      Alert.alert("Erreur", "L'heure de départ ne peut pas être antérieure à l'heure d'arrivée.");
      return;
    }
    const newId =
      mockData.length > 0
        ? Math.max(...mockData.map((d) => d.bus_rotation_id)) + 1
        : 1;
    setMockData([
      ...mockData,
      {
        bus_rotation_id: newId,
        exploitants,
        arrival_time: arrivalTime,
        departure_time: departureTime,
        passenger_count: Number(passengerCount),
        observations,
      },
    ]);
    setExploitants("");
    setArrivalTime("");
    setDepartureTime("");
    setPassengerCount("");
    setObservations("");
    setModalVisible(false);
  };

  // Open edit modal and prefill fields
  const handleEdit = () => {
    if (selectedRow !== null) {
      const item = mockData[selectedRow];
      setEditExploitants(item.exploitants);
      setEditArrivalTime(item.arrival_time);
      setEditDepartureTime(item.departure_time);
      setEditPassengerCount(item.passenger_count.toString());
      setEditObservations(item.observations);
      setEditModalVisible(true);
    }
  };

  // Save changes
  const handleValidateEdit = () => {
    if (editArrivalTime && editDepartureTime && new Date(editDepartureTime) < new Date(editArrivalTime)) {
      Alert.alert("Erreur", "L'heure de départ ne peut pas être antérieure à l'heure d'arrivée.");
      return;
    }
    if (selectedRow !== null) {
      setMockData((prev) =>
        prev.map((item, idx) =>
          idx === selectedRow
            ? {
                ...item,
                exploitants: editExploitants,
                arrival_time: editArrivalTime,
                departure_time: editDepartureTime,
                passenger_count: Number(editPassengerCount),
                observations: editObservations,
              }
            : item
        )
      );
      setEditModalVisible(false);
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: typeof mockData[0];
    index: number;
  }) => {
    const isSelected = selectedRow === index;
    const isHovered = hoveredRow === index;

    // Check if required fields are missing (except observations)
    const missingFields: string[] = [];
    if (!item.exploitants) missingFields.push("N° exploitants");
    if (!item.arrival_time) missingFields.push("Heure d'arrivée");
    if (!item.departure_time) missingFields.push("Heure de départ");
    if (!item.passenger_count) missingFields.push("Nombre de passagers");
    const isIncomplete = missingFields.length > 0;

    return (
      <Pressable
        style={[
          styles.row,
          isSelected && styles.selectedRow,
          isHovered && styles.hoveredRow,
          isIncomplete && styles.incompleteRow,
        ]}
        onPress={() => setSelectedRow(isSelected ? null : index)}
        onHoverIn={() => setHoveredRow(index)}
        onHoverOut={() => setHoveredRow(null)}
      >
        <View style={[styles.cell, styles.checkboxCell]}>
          <FontAwesome
            name={isSelected ? "check-square" : "square-o"}
            size={18}
            color={isSelected ? "#2D80E1" : "#D1D1D1"}
          />
        </View>
        <Text style={[styles.cell, styles.indexCell]}>{item.bus_rotation_id}</Text>
        <Text style={styles.cell}>{item.exploitants}</Text>
        <Text style={styles.cell}>
          {item.arrival_time
            ? formatTime(item.arrival_time)
            : "—"}
        </Text>
        <Text style={styles.cell}>
          {item.departure_time
            ? formatTime(item.departure_time)
            : "—"}
        </Text>
        <Text style={styles.cell}>{item.passenger_count}</Text>
        <Text style={styles.cell}>{item.observations || "—"}</Text>
        {/* Warning button for incomplete row */}
        {isIncomplete && (
          <TouchableOpacity
            style={styles.rowWarningButton}
            onPress={() => {
              setRowWarningMessage(
                `Champs manquants : ${missingFields.join(", ")}`
              );
              setRowWarningVisible(true);
            }}
          >
            <View style={styles.rowWarningCircle}>
              <Text style={styles.rowWarningMark}>?</Text>
            </View>
          </TouchableOpacity>
        )}
      </Pressable>
    );
  };

  // Table header component
  const TableHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.checkboxCell]}></Text>
        <Text style={[styles.headerCell, styles.indexCell]}>ORDRE</Text>
        <Text style={styles.headerCell}>N° EXPLOITANTS</Text>
        <Text style={styles.headerCell}>HEURE D&apos;ARRIVEE</Text>
        <Text style={styles.headerCell}>HEURE DE DEPART</Text>
        <Text style={styles.headerCell}>N° PASSAGERS</Text>
        <Text style={styles.headerCell}>OBSERVATIONS/REMARQUES</Text>
      </View>
    </View>
  );

  // Helper to format time as HH:mm
  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d
      .toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
  };

  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [rowWarningVisible, setRowWarningVisible] = useState(false);
  const [rowWarningMessage, setRowWarningMessage] = useState("");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.headerTitle}>
          <Text style={styles.blueText}>
            GARE ROUTIERE GUMBS ANTOINE JULIEN
          </Text>{" "}
          <Text style={styles.redText}>
            ROTATIONS JOURNALIERES EXPLOITANTS BUS TCP/TCI/Z
          </Text>{" "}
          <Text style={styles.blueText}>{todayDate}</Text>
        </Text>
      </View>

      {/* Table */}
      <View style={styles.tableContainer}>
        <TableHeader />
        <FlatList
          data={mockData}
          keyExtractor={(item, index) => `${item.bus_rotation_id || index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={true}
        />
      </View>

      {/* Floating Action Buttons */}
      {selectedRow === null ? (
        // Show Add Button
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <AntDesign name="plus" size={32} color="white" />
        </TouchableOpacity>
      ) : (
        // Show Modify and Delete Buttons
        <View style={styles.actionFabContainer}>
          <TouchableOpacity
            style={styles.modifyFab}
            onPress={handleEdit}
            activeOpacity={0.7}
          >
            <FontAwesome name="pencil" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteFab}
            onPress={() => setConfirmDeleteVisible(true)}
            activeOpacity={0.7}
          >
            <FontAwesome name="trash" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Modal for adding new data */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter une rotation bus</Text>
            <RNPickerSelect
              onValueChange={(value) => {
                setExploitants(value);
                setPassengerCount(""); // Reset passenger count when exploitant changes
              }}
              items={exploitantsOptions}
              value={exploitants}
              placeholder={{ label: "Sélectionner N° Exploitants", value: null }}
              style={{
                inputIOS: styles.input,
                inputAndroid: styles.input,
                placeholder: { color: "#888" },
              }}
            />

            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowArrivalPicker(true)}
            >
              <Text>
                {arrivalTime ? formatTime(arrivalTime) : "Heure d'arrivée"}
              </Text>
            </TouchableOpacity>
            {showArrivalPicker && (
              <DateTimePicker
                value={arrivalTime ? new Date(arrivalTime) : new Date()}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={(event, selectedDate) => {
                  setShowArrivalPicker(false);
                  if (selectedDate) {
                    const today = new Date();
                    selectedDate.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
                    setArrivalTime(selectedDate.toISOString());
                  }
                }}
              />
            )}
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDeparturePicker(true)}
            >
              <Text>
                {departureTime ? formatTime(departureTime) : "Heure de départ"}
              </Text>
            </TouchableOpacity>
            {showDeparturePicker && (
              <DateTimePicker
                value={departureTime ? new Date(departureTime) : new Date()}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={(event, selectedDate) => {
                  setShowDeparturePicker(false);
                  if (selectedDate) {
                    const today = new Date();
                    selectedDate.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
                    setDepartureTime(selectedDate.toISOString());
                  }
                }}
              />
            )}

            {/* Move the passenger picker here, under the time pickers */}
            {exploitants ? (
              <RNPickerSelect
                onValueChange={setPassengerCount}
                items={Array.from({ length: exploitantsCapacity[exploitants] }, (_, i) => ({
                  label: (i + 1).toString(),
                  value: (i + 1).toString(),
                }))}
                value={passengerCount}
                placeholder={{ label: "Nombre de passagers", value: null }}
                style={{
                  inputIOS: styles.input,
                  inputAndroid: styles.input,
                  placeholder: { color: "#888" },
                }}
              />
            ) : null}

            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
              {observationKeywords.map((keyword) => (
                <TouchableOpacity
                  key={keyword}
                  style={{
                    backgroundColor: "#F0F0F0",
                    borderRadius: 16,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                  onPress={() => setObservations(keyword)}
                >
                  <Text style={{ color: "#2D80E1", fontWeight: "bold" }}>{keyword}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Observations"
              value={observations}
              onChangeText={setObservations}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddData}
              >
                <Text style={styles.modalButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for editing data */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier la rotation bus</Text>
            <RNPickerSelect
              onValueChange={(value) => {
                setEditExploitants(value);
                setEditPassengerCount(""); // Reset passenger count when exploitant changes
              }}
              items={exploitantsOptions}
              value={editExploitants}
              placeholder={{ label: "Sélectionner N° Exploitants", value: null }}
              style={{
                inputIOS: styles.input,
                inputAndroid: styles.input,
                placeholder: { color: "#888" },
              }}
            />

            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowEditArrivalPicker(true)}
            >
              <Text>
                {editArrivalTime ? formatTime(editArrivalTime) : "Heure d'arrivée"}
              </Text>
            </TouchableOpacity>
            {showEditArrivalPicker && (
              <DateTimePicker
                value={editArrivalTime ? new Date(editArrivalTime) : new Date()}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={(event, selectedDate) => {
                  setShowEditArrivalPicker(false);
                  if (selectedDate) {
                    const today = new Date();
                    selectedDate.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
                    setEditArrivalTime(selectedDate.toISOString());
                  }
                }}
              />
            )}
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowEditDeparturePicker(true)}
            >
              <Text>
                {editDepartureTime ? formatTime(editDepartureTime) : "Heure de départ"}
              </Text>
            </TouchableOpacity>
            {showEditDeparturePicker && (
              <DateTimePicker
                value={editDepartureTime ? new Date(editDepartureTime) : new Date()}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={(event, selectedDate) => {
                  setShowEditDeparturePicker(false);
                  if (selectedDate) {
                    const today = new Date();
                    selectedDate.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
                    setEditDepartureTime(selectedDate.toISOString());
                  }
                }}
              />
            )}

            {/* Move the passenger picker here, under the time pickers */}
            {editExploitants ? (
              <RNPickerSelect
                onValueChange={setEditPassengerCount}
                items={Array.from({ length: exploitantsCapacity[editExploitants] }, (_, i) => ({
                  label: (i + 1).toString(),
                  value: (i + 1).toString(),
                }))}
                value={editPassengerCount}
                placeholder={{ label: "Nombre de passagers", value: null }}
                style={{
                  inputIOS: styles.input,
                  inputAndroid: styles.input,
                  placeholder: { color: "#888" },
                }}
              />
            ) : null}

            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
              {observationKeywords.map((keyword) => (
                <TouchableOpacity
                  key={keyword}
                  style={{
                    backgroundColor: "#F0F0F0",
                    borderRadius: 16,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                  onPress={() => setEditObservations(keyword)}
                >
                  <Text style={{ color: "#2D80E1", fontWeight: "bold" }}>{keyword}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Observations"
              value={editObservations}
              onChangeText={setEditObservations}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleValidateEdit}
              >
                <Text style={styles.modalButtonText}>Valider</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirmation Delete Modal */}
      <Modal
        visible={confirmDeleteVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmDeleteVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.modalTitle}>Confirmer la suppression</Text>
            <Text style={{ marginBottom: 20, textAlign: "center" }}>
              Voulez-vous vraiment supprimer la rotation bus de <Text style={{ fontWeight: "bold" }}>{selectedRow !== null ? mockData[selectedRow].exploitants : ""}</Text> ?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setConfirmDeleteVisible(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={() => {
                  setMockData((prev) =>
                    prev.filter((_, idx) => idx !== selectedRow)
                  );
                  setSelectedRow(null);
                  setConfirmDeleteVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Warning Modal */}
      <Modal
        visible={warningVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setWarningVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.warningModalContent}>
            <Text style={styles.modalTitle}>Avertissement</Text>
            <Text style={{ marginBottom: 20, textAlign: "center" }}>
              {warningMessage}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setWarningVisible(false)}
              >
                <Text style={styles.modalButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Row Warning Modal */}
      <Modal
        visible={rowWarningVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setRowWarningVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.modalTitle}>Problème avec la ligne</Text>
            <Text style={{ marginBottom: 20, textAlign: "center" }}>
              {rowWarningMessage}
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setRowWarningVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6F3",
    position: "relative",
  },
  pageHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EBEAEA",
    backgroundColor: "white",
  },
  tableContainer: {
    flex: 1,
    margin: 12,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
    height: "auto",
    minHeight: "75%",
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#EBEAEA",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "#F9F9F8",
  },
  headerCell: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 12,
    fontWeight: "500",
    color: "#6B6B6B",
    textAlign: "left",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EBEAEA",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  selectedRow: {
    backgroundColor: "rgba(46, 170, 220, 0.1)",
  },
  hoveredRow: {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  cell: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 6,
    color: "#37352F",
    textAlign: "left",
  },
  checkboxCell: {
    flex: 0.3,
    alignItems: "center",
    justifyContent: "center",
  },
  indexCell: {
    flex: 0.5,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  blueText: {
    color: "#2D80E1",
  },
  redText: {
    color: "#EB5757",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    backgroundColor: "#2D80E1",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionFabContainer: {
    position: "absolute",
    right: 24,
    bottom: 24,
    flexDirection: "row",
    gap: 12,
  },
  modifyFab: {
    backgroundColor: "#FFD600",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  deleteFab: {
    backgroundColor: "#EB5757",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 8,
  },
  confirmModalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 8,
    alignItems: "center",
  },
  warningModalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 8,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#EBEAEA",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
    backgroundColor: "#F9F9F8",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#2D80E1", // Blue for Annuler
  },
  addButton: {
    backgroundColor: "#27AE60", // Green for Ajouter
  },
  deleteButton: {
    backgroundColor: "#EB5757", // Red for Supprimer
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  incompleteRow: {
    backgroundColor: "#FFF3CD", // light yellow to indicate missing data
  },
  rowWarningButton: {
    marginLeft: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  rowWarningCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#EB5757",
    justifyContent: "center",
    alignItems: "center",
  },
  rowWarningMark: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 16,
  },
});
