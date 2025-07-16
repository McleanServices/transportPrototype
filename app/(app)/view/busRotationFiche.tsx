import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

// Mock data
const mockData = [
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

export default function BusRotationFiche() {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const todayDate = new Date().toLocaleDateString("fr-FR");

  const renderItem = ({
    item,
    index,
  }: {
    item: typeof mockData[0];
    index: number;
  }) => {
    const isSelected = selectedRow === index;
    const isHovered = hoveredRow === index;

    return (
      <Pressable
        style={[
          styles.row,
          isSelected && styles.selectedRow,
          isHovered && styles.hoveredRow,
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
          {new Date(item.arrival_time).toLocaleTimeString()}
        </Text>
        <Text style={styles.cell}>
          {item.departure_time
            ? new Date(item.departure_time).toLocaleTimeString()
            : "—"}
        </Text>
        <Text style={styles.cell}>{item.passenger_count}</Text>
        <Text style={styles.cell}>{item.observations || "—"}</Text>
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
});
