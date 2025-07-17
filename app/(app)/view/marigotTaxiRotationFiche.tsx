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
  Alert,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";

// Mock data
const initialData = [
  {
    marigot_taxi_id: 1,
    taxi_id: "TX-101",
    boat_name: "Ferry Express",
    other_transport: "Bus",
    destination: "Philipsburg",
    passenger_count: 4,
    observations: "On time",
  },
  {
    marigot_taxi_id: 2,
    taxi_id: "TX-102",
    boat_name: "Sea Shuttle",
    other_transport: "",
    destination: "Grand Case",
    passenger_count: 2,
    observations: "Delayed",
  },
  {
    marigot_taxi_id: 3,
    taxi_id: "TX-103",
    boat_name: "",
    other_transport: "Bike",
    destination: "Orient Bay",
    passenger_count: 1,
    observations: "",
  },
];

const taxiOptions = [
  { label: "TX-101", value: "TX-101" },
  { label: "TX-102", value: "TX-102" },
  { label: "TX-103", value: "TX-103" },
];

const destinationOptions = [
  { label: "Philipsburg", value: "Philipsburg" },
  { label: "Grand Case", value: "Grand Case" },
  { label: "Orient Bay", value: "Orient Bay" },
];

const observationKeywords = [
  "RAS",
  "En retard",
  "Annulé",
  "Complet",
  "Incident technique",
];

const boatOptions = [
  { label: "Ferry Express", value: "Ferry Express" },
  { label: "Sea Shuttle", value: "Sea Shuttle" },
  { label: "Caribbean Queen", value: "Caribbean Queen" },
  { label: "Island Hopper", value: "Island Hopper" },
];

const otherTransportKeywords = [
  "Bus",
  "Bike",
  "Taxi collectif",
  "Navette privée",
];

export default function MarigotTaxiRotationFiche() {
  const [mockData, setMockData] = useState(initialData);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Add/Edit modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);

  // Form state
  const [taxiId, setTaxiId] = useState("");
  const [boatName, setBoatName] = useState("");
  const [otherTransport, setOtherTransport] = useState("");
  const [destination, setDestination] = useState("");
  const [passengerCount, setPassengerCount] = useState("");
  const [observations, setObservations] = useState("");

  // Edit form state
  const [editTaxiId, setEditTaxiId] = useState("");
  const [editBoatName, setEditBoatName] = useState("");
  const [editOtherTransport, setEditOtherTransport] = useState("");
  const [editDestination, setEditDestination] = useState("");
  const [editPassengerCount, setEditPassengerCount] = useState("");
  const [editObservations, setEditObservations] = useState("");

  // Warning message state
  const [warningMessage, setWarningMessage] = useState("");

  // Add/Edit logic
  const handleAddData = () => {
    const newId =
      mockData.length > 0
        ? Math.max(...mockData.map((d) => d.marigot_taxi_id)) + 1
        : 1;
    setMockData([
      ...mockData,
      {
        marigot_taxi_id: newId,
        taxi_id: taxiId,
        boat_name: boatName,
        other_transport: otherTransport,
        destination,
        passenger_count: Number(passengerCount),
        observations,
      },
    ]);
    setTaxiId("");
    setBoatName("");
    setOtherTransport("");
    setDestination("");
    setPassengerCount("");
    setObservations("");
    setModalVisible(false);
  };

  const handleEdit = () => {
    if (selectedRow !== null) {
      const item = mockData[selectedRow];
      setEditTaxiId(item.taxi_id);
      setEditBoatName(item.boat_name);
      setEditOtherTransport(item.other_transport);
      setEditDestination(item.destination);
      setEditPassengerCount(item.passenger_count.toString());
      setEditObservations(item.observations);
      setEditModalVisible(true);
    }
  };

  const handleValidateEdit = () => {
    if (selectedRow !== null) {
      setMockData((prev) =>
        prev.map((item, idx) =>
          idx === selectedRow
            ? {
                ...item,
                taxi_id: editTaxiId,
                boat_name: editBoatName,
                other_transport: editOtherTransport,
                destination: editDestination,
                passenger_count: Number(editPassengerCount),
                observations: editObservations,
              }
            : item
        )
      );
      setEditModalVisible(false);
    }
  };

  // Highlight incomplete rows
  const renderItem = ({
    item,
    index,
  }: {
    item: typeof mockData[0];
    index: number;
  }) => {
    const isSelected = selectedRow === index;
    const isHovered = hoveredRow === index;
    const isIncomplete =
      !item.taxi_id ||
      !item.destination ||
      !item.passenger_count ||
      (
        // Must have either boat or other transport, not both, not neither
        (!item.boat_name && !item.other_transport) ||
        (item.boat_name && item.other_transport)
      );

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
          {item.marigot_taxi_id}
        </Text>
        <Text style={styles.cell}>{item.taxi_id}</Text>
        <Text style={styles.cell}>{item.boat_name || "-"}</Text>
        <Text style={styles.cell}>{item.other_transport || "-"}</Text>
        <Text style={styles.cell}>{item.destination}</Text>
        <Text style={styles.cell}>{item.passenger_count}</Text>
        <Text style={styles.cell}>{item.observations || "—"}</Text>
        {isIncomplete && (
          <TouchableOpacity
            style={styles.warningButton}
            onPress={() => {
              let msg = "Champs manquants : ";
              const missing = [];
              if (!item.taxi_id) missing.push("N° Taxi");
              if (!item.destination) missing.push("Destination");
              if (!item.passenger_count) missing.push("Nombre de passagers");
              if (!item.boat_name && !item.other_transport)
                missing.push("Bateau ou Autre transport");
              if (item.boat_name && item.other_transport)
                missing.push("Ne choisissez qu'un seul : Bateau ou Autre transport");
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

  // TableHeader component
  const TableHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.checkboxCell]}></Text>
        <Text style={[styles.headerCell, styles.indexCell]}>ORDRE</Text>
        <Text style={styles.headerCell}>N° TAXI</Text>
        <Text style={styles.headerCell}>BATEAU</Text>
        <Text style={styles.headerCell}>AUTRE TRANSPORT</Text>
        <Text style={styles.headerCell}>DESTINATION</Text>
        <Text style={styles.headerCell}>N° PASSAGERS</Text>
        <Text style={styles.headerCell}>OBSERVATIONS</Text>
      </View>
    </View>
  );

  const handleBoatSelect = (value: string) => {
    setBoatName(value);
    setOtherTransport(""); // Clear other transport when boat is selected
  };

  const handleOtherTransportSelect = (value: string) => {
    setOtherTransport(value);
    setBoatName(""); // Clear boat when other transport is selected
  };

  const handleEditBoatSelect = (value: string) => {
    setEditBoatName(value);
    setEditOtherTransport("");
  };

  const handleEditOtherTransportSelect = (value: string) => {
    setEditOtherTransport(value);
    setEditBoatName("");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.headerTitle}>
          <Text style={styles.blueText}>MARIGOT TAXI ROTATIONS</Text>{" "}
          <Text style={styles.redText}>DAILY ROTATIONS</Text>
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
            keyExtractor={(item, index) => `${item.marigot_taxi_id || index}`}
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
          onPress={() => setModalVisible(true)}
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

      {/* Add Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter une rotation taxi</Text>
            <RNPickerSelect
              onValueChange={setTaxiId}
              items={taxiOptions}
              value={taxiId}
              placeholder={{ label: "Sélectionner N° Taxi", value: null }}
              style={{
                inputIOS: styles.input,
                inputAndroid: styles.input,
                placeholder: { color: "#888" },
              }}
            />
            <RNPickerSelect
              onValueChange={handleBoatSelect}
              items={boatOptions}
              value={boatName}
              placeholder={{ label: "Sélectionner Bateau", value: null }}
              style={{
                inputIOS: styles.input,
                inputAndroid: styles.input,
                placeholder: { color: "#888" },
              }}
              disabled={!!otherTransport} // Disable if Autre transport is filled
            />
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
              {otherTransportKeywords.map((keyword) => (
                <TouchableOpacity
                  key={keyword}
                  style={{
                    backgroundColor: "#F0F0F0",
                    borderRadius: 16,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    marginRight: 8,
                    marginBottom: 8,
                    opacity: boatName ? 0.5 : 1,
                  }}
                  onPress={() => !boatName && handleOtherTransportSelect(keyword)}
                  disabled={!!boatName} // Disable if Bateau is picked
                >
                  <Text style={{ color: "#2D80E1", fontWeight: "bold" }}>{keyword}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Autre transport (optionnel)"
              value={otherTransport}
              onChangeText={text => !boatName && setOtherTransport(text)}
              editable={!boatName} // Disable if Bateau is picked
            />
            <RNPickerSelect
              onValueChange={setDestination}
              items={destinationOptions}
              value={destination}
              placeholder={{ label: "Sélectionner destination", value: null }}
              style={{
                inputIOS: styles.input,
                inputAndroid: styles.input,
                placeholder: { color: "#888" },
              }}
            />
            <RNPickerSelect
              onValueChange={setPassengerCount}
              items={Array.from({ length: 8 }, (_, i) => ({
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

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier la rotation taxi</Text>
            <RNPickerSelect
              onValueChange={setEditTaxiId}
              items={taxiOptions}
              value={editTaxiId}
              placeholder={{ label: "Sélectionner N° Taxi", value: null }}
              style={{
                inputIOS: styles.input,
                inputAndroid: styles.input,
                placeholder: { color: "#888" },
              }}
            />
            <RNPickerSelect
              onValueChange={handleEditBoatSelect}
              items={boatOptions}
              value={editBoatName}
              placeholder={{ label: "Sélectionner Bateau", value: null }}
              style={{
                inputIOS: styles.input,
                inputAndroid: styles.input,
                placeholder: { color: "#888" },
              }}
              disabled={!!editOtherTransport}
            />
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
              {otherTransportKeywords.map((keyword) => (
                <TouchableOpacity
                  key={keyword}
                  style={{
                    backgroundColor: "#F0F0F0",
                    borderRadius: 16,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    marginRight: 8,
                    marginBottom: 8,
                    opacity: editBoatName ? 0.5 : 1,
                  }}
                  onPress={() => !editBoatName && handleEditOtherTransportSelect(keyword)}
                  disabled={!!editBoatName}
                >
                  <Text style={{ color: "#2D80E1", fontWeight: "bold" }}>{keyword}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Autre transport (optionnel)"
              value={editOtherTransport}
              onChangeText={text => !editBoatName && setEditOtherTransport(text)}
              editable={!editBoatName}
            />
            <RNPickerSelect
              onValueChange={setEditDestination}
              items={destinationOptions}
              value={editDestination}
              placeholder={{ label: "Sélectionner destination", value: null }}
              style={{
                inputIOS: styles.input,
                inputAndroid: styles.input,
                placeholder: { color: "#888" },
              }}
            />
            <RNPickerSelect
              onValueChange={setEditPassengerCount}
              items={Array.from({ length: 8 }, (_, i) => ({
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

      {/* Delete Confirmation Modal */}
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
              Voulez-vous vraiment supprimer la rotation taxi de <Text style={{ fontWeight: "bold" }}>{selectedRow !== null ? mockData[selectedRow].taxi_id : ""}</Text> ?
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
  incompleteRow: {
    backgroundColor: "#FFF3CD",
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
    minHeight: 40, // Add this line
  },
  cancelButton: {
    backgroundColor: "#2D80E1",
  },
  addButton: {
    backgroundColor: "#27AE60",
  },
  deleteButton: {
    backgroundColor: "#EB5757",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  messageContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
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
});
