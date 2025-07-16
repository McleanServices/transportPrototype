import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

// Mock data
const mockData = [
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

export default function MarigotTaxiRotationFiche() {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

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
        <Text style={[styles.cell, styles.indexCell]}>
          {item.marigot_taxi_id}
        </Text>
        <Text style={styles.cell}>{item.taxi_id}</Text>
        <Text style={styles.cell}>{item.boat_name || "-"}</Text>
        <Text style={styles.cell}>{item.other_transport || "-"}</Text>
        <Text style={styles.cell}>{item.destination}</Text>
        <Text style={styles.cell}>{item.passenger_count}</Text>
        <Text style={styles.cell}>{item.observations || "—"}</Text>
      </Pressable>
    );
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
});
