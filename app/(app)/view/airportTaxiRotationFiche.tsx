import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Pressable,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";

// Mock data
const mockData = [
  {
    airport_taxi_id: 1,
    numero_exploitants: "TX-001",
    airline_name: "Air France",
    destination: "Paris",
    passenger_count: 3,
    observations: "On time",
  },
  {
    airport_taxi_id: 2,
    numero_exploitants: "TX-002",
    airline_name: "KLM",
    destination: "Amsterdam",
    passenger_count: 2,
    observations: "Delayed",
  },
  {
    airport_taxi_id: 3,
    numero_exploitants: "TX-003",
    airline_name: "Delta",
    destination: "New York",
    passenger_count: 4,
    observations: "",
  },
];

const exploitantsOptions = [
  { label: "TX-001", value: "TX-001" },
  { label: "TX-002", value: "TX-002" },
  { label: "TX-003", value: "TX-003" },
  // Add more as needed
];

const airlineOptions = [
  { label: "Air France", value: "Air France" },
  { label: "KLM", value: "KLM" },
  { label: "Delta", value: "Delta" },
  // Add more as needed
];

const destinationOptions = [
  { label: "Paris", value: "Paris" },
  { label: "Amsterdam", value: "Amsterdam" },
  { label: "New York", value: "New York" },
  // Add more as needed
];

export default function AirportTaxiRotationFiche() {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [warningVisible, setWarningVisible] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  // Edit states
  const [editNumeroExploitants, setEditNumeroExploitants] = useState("");
  const [editAirlineName, setEditAirlineName] = useState("");
  const [editDestination, setEditDestination] = useState("");
  const [editPassengerCount, setEditPassengerCount] = useState("");
  const [editObservations, setEditObservations] = useState("");

  // Add states
  const [addNumeroExploitants, setAddNumeroExploitants] = useState("");
  const [addAirlineName, setAddAirlineName] = useState("");
  const [addDestination, setAddDestination] = useState("");
  const [addPassengerCount, setAddPassengerCount] = useState("");
  const [addObservations, setAddObservations] = useState("");

  // TableHeader component
  const TableHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.checkboxCell]}></Text>
        <Text style={[styles.headerCell, styles.indexCell]}>ORDRE</Text>
        <Text style={styles.headerCell}>N° EXPLOITANTS</Text>
        <Text style={styles.headerCell}>COMPAGNIE AERIENNE</Text>
        <Text style={styles.headerCell}>DESTINATION</Text>
        <Text style={styles.headerCell}>N° PASSAGERS</Text>
        <Text style={styles.headerCell}>OBSERVATIONS</Text>
      </View>
    </View>
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: typeof mockData[0];
    index: number;
  }) => {
    const isSelected = selectedRow === index;
    const isHovered = hoveredRow === index;

    // Highlight incomplete rows (except observations)
    const isIncomplete =
      !item.numero_exploitants ||
      !item.airline_name ||
      !item.destination ||
      !item.passenger_count;

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
        <Text style={[styles.cell, styles.indexCell]}>
          {item.airport_taxi_id}
        </Text>
        <Text style={styles.cell}>{item.numero_exploitants}</Text>
        <Text style={styles.cell}>{item.airline_name || "-"}</Text>
        <Text style={styles.cell}>{item.destination}</Text>
        <Text style={styles.cell}>{item.passenger_count}</Text>
        <Text style={styles.cell}>{item.observations || "—"}</Text>
        {isIncomplete && (
          <TouchableOpacity
            style={styles.warningButton}
            onPress={() => {
              let msg = "Champs manquants : ";
              const missing = [];
              if (!item.numero_exploitants) missing.push("N° exploitants");
              if (!item.airline_name) missing.push("Compagnie aérienne");
              if (!item.destination) missing.push("Destination");
              if (!item.passenger_count) missing.push("Nombre de passagers");
              setWarningMessage(msg + missing.join(", "));
              setWarningVisible(true);
            }}
          >
            <View style={styles.warningCircle}>
              <Text style={styles.warningMark}>?</Text>
            </View>
          </TouchableOpacity>
        )}
      </Pressable>
    );
  };

  // When opening the edit modal, pre-fill the fields
  const handleEdit = () => {
    if (selectedRow !== null) {
      const item = mockData[selectedRow];
      setEditNumeroExploitants(item.numero_exploitants);
      setEditAirlineName(item.airline_name);
      setEditDestination(item.destination);
      setEditPassengerCount(item.passenger_count.toString());
      setEditObservations(item.observations);
      setEditModalVisible(true);
    }
  };

  // Save changes
  const handleValidateEdit = () => {
    if (selectedRow !== null) {
      mockData[selectedRow] = {
        ...mockData[selectedRow],
        numero_exploitants: editNumeroExploitants,
        airline_name: editAirlineName,
        destination: editDestination,
        passenger_count: Number(editPassengerCount),
        observations: editObservations,
      };
      setEditModalVisible(false);
    }
  };

  // Add new entry
  const handleAdd = () => {
    const newItem = {
      airport_taxi_id: mockData.length + 1,
      numero_exploitants: addNumeroExploitants,
      airline_name: addAirlineName,
      destination: addDestination,
      passenger_count: Number(addPassengerCount),
      observations: addObservations,
    };
    mockData.push(newItem);
    setAddModalVisible(false);
  };

  const handleOpenAddModal = () => {
    setAddNumeroExploitants("");
    setAddAirlineName("");
    setAddDestination("");
    setAddPassengerCount("");
    setAddObservations("");
    setAddModalVisible(true);
  };

  // Delete entry
  const handleDelete = () => {
    if (selectedRow !== null) {
      mockData.splice(selectedRow, 1);
      setSelectedRow(null);
      setConfirmDeleteVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.headerTitle}>
          <Text style={styles.blueText}>
            PRINCESS JULIANA INTERNATIONAL AIRPORT
          </Text>{" "}
          <Text style={styles.redText}>
            ROTATIONS JOURNALIERES TAXIS AEROPORT
          </Text>
        </Text>
      </View>

      {/* Table */}
      <View style={styles.tableContainer}>
        <TableHeader />
        {mockData.length === 0 ? (
          <View style={styles.messageContainer}>
            <Text>No records found. Add a new entry to get started.</Text>
          </View>
        ) : (
          <FlatList
            data={mockData}
            keyExtractor={(item, index) => `${item.airport_taxi_id || index}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={true}
          />
        )}
      </View>

      {/* Floating Action Buttons */}
      {selectedRow === null ? (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleOpenAddModal}
          activeOpacity={0.7}
        >
          <AntDesign name="plus" size={32} color="white" />
        </TouchableOpacity>
      ) : (
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

      {/* Warning Modal */}
      <Modal
        visible={warningVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setWarningVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.modalTitle}>Problème avec la ligne</Text>
            <Text style={{ marginBottom: 20, textAlign: "center" }}>
              {warningMessage}
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setWarningVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Modal */}
      <Modal
        visible={addModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter une rotation taxi</Text>

            <Text style={{ marginBottom: 8 }}>N° exploitants</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={addNumeroExploitants}
                onValueChange={setAddNumeroExploitants}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                mode="dropdown"
              >
                <Picker.Item label="Sélectionner..." value="" />
                {exploitantsOptions.map(opt => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
            </View>

            <Text style={{ marginBottom: 8 }}>Compagnie aérienne</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={addAirlineName}
                onValueChange={setAddAirlineName}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                mode="dropdown"
              >
                <Picker.Item label="Sélectionner..." value="" />
                {airlineOptions.map(opt => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
            </View>

            <Text style={{ marginBottom: 8 }}>Destination</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={addDestination}
                onValueChange={setAddDestination}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                mode="dropdown"
              >
                <Picker.Item label="Sélectionner..." value="" />
                {destinationOptions.map(opt => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
            </View>

            <Text style={{ marginBottom: 8 }}>Nombre de passagers</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={addPassengerCount}
                onValueChange={setAddPassengerCount}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {[...Array(200)].map((_, i) => (
                  <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} />
                ))}
              </Picker>
            </View>

            <Text style={{ marginBottom: 8 }}>Observations</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
              {["RAS", "En retard", "Annulé", "Complet", "Incident technique"].map(keyword => (
                <TouchableOpacity
                  key={keyword}
                  style={{
                    backgroundColor: addObservations === keyword ? "#2D80E1" : "#F0F0F0",
                    borderRadius: 16,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                  onPress={() => setAddObservations(keyword)}
                >
                  <Text style={{
                    color: addObservations === keyword ? "white" : "#2D80E1",
                    fontWeight: "bold"
                  }}>
                    {keyword}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Autre observation"
              value={addObservations}
              onChangeText={setAddObservations}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={() => {
                  const maxId = mockData.length > 0
                    ? Math.max(...mockData.map(item => item.airport_taxi_id))
                    : 0;
                  mockData.push({
                    airport_taxi_id: maxId + 1,
                    numero_exploitants: addNumeroExploitants,
                    airline_name: addAirlineName,
                    destination: addDestination,
                    passenger_count: Number(addPassengerCount),
                    observations: addObservations,
                  });
                  setAddModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier la rotation taxi</Text>

            <Text style={{ marginBottom: 8 }}>N° exploitants</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={editNumeroExploitants}
                onValueChange={setEditNumeroExploitants}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                mode="dropdown"
              >
                <Picker.Item label="Sélectionner..." value="" />
                {exploitantsOptions.map(opt => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
            </View>

            <Text style={{ marginBottom: 8 }}>Compagnie aérienne</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={editAirlineName}
                onValueChange={setEditAirlineName}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                mode="dropdown"
              >
                <Picker.Item label="Sélectionner..." value="" />
                {airlineOptions.map(opt => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
            </View>

            <Text style={{ marginBottom: 8 }}>Destination</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={editDestination}
                onValueChange={setEditDestination}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                mode="dropdown"
              >
                <Picker.Item label="Sélectionner..." value="" />
                {destinationOptions.map(opt => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
            </View>

            <Text style={{ marginBottom: 8 }}>Nombre de passagers</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={editPassengerCount}
                onValueChange={setEditPassengerCount}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {[...Array(200)].map((_, i) => (
                  <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} />
                ))}
              </Picker>
            </View>

            <Text style={{ marginBottom: 8 }}>Observations</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
              {["RAS", "En retard", "Annulé", "Complet", "Incident technique"].map(keyword => (
                <TouchableOpacity
                  key={keyword}
                  style={{
                    backgroundColor: editObservations === keyword ? "#2D80E1" : "#F0F0F0",
                    borderRadius: 16,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                  onPress={() => setEditObservations(keyword)}
                >
                  <Text style={{
                    color: editObservations === keyword ? "white" : "#2D80E1",
                    fontWeight: "bold"
                  }}>
                    {keyword}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Autre observation"
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

      {/* Delete Confirmation Modal */}
      <Modal
        visible={confirmDeleteVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmDeleteVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.modalTitle}>Supprimer la rotation taxi ?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setConfirmDeleteVisible(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Text style={styles.modalButtonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
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
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  warningButton: {
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  warningCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#EB5757",
    justifyContent: "center",
    alignItems: "center",
  },
  warningMark: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  incompleteRow: {
    backgroundColor: "#FFF3CD",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmModalContent: {
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
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 4,
    minHeight: 40,
  },
  cancelButton: {
    backgroundColor: "#2D80E1", // blue
  },
  deleteButton: {
    backgroundColor: "#EB5757", // red
  },
  addButton: {
    backgroundColor: "#27AE60", // green
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
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
  input: {
    height: 40,
    borderColor: "#EBEAEA",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    width: "100%",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#EBEAEA",
    borderRadius: 8,
    backgroundColor: "#F9F9F8",
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingVertical: 4, // Add this for extra space
  },
  picker: {
    height: 56, // Increased from 44
    width: "100%",
    color: "#37352F",
    fontSize: 18, // Increased from 16
    paddingVertical: 12, // Add this for extra space
  },
  pickerItem: {
    fontSize: 18,
    color: "#37352F",
    paddingVertical: 16, // Increased from 12
  },
});
