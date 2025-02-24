import { useState, useEffect } from 'react';
import airportTaxiRotationService from '../services/airportTaxiRotationService';

export interface AirportTaxiRotationFormData {
  airport_taxi_id?: number;
  numero_exploitants: string;
  order_number: number;
  taxi_id: number;
  airline_id: number;
  destination: string;
  passenger_count: number;
  observations: string | null;
  date: string;
  created_at?: string;
  airline_name: string;
}

export function useAirportTaxiRotationData() {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<AirportTaxiRotationFormData[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const records = await airportTaxiRotationService.getAllAirportTaxiRotations();
      setData(records);
    } catch (error) {
      console.error('Error fetching data from database', error);
      setData([]);
    }
  };

  const refreshData = async () => {
    await fetchData();
  };

  const handleFormSubmit = async (newFormData: AirportTaxiRotationFormData) => {
    try {
      const newId = await airportTaxiRotationService.createAirportTaxiRotation(newFormData);
      if (newId) {
        await refreshData(); // Refresh data after successful insertion
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating new record', error);
      throw error;
    }
  };

  const handleEditFormSubmit = async (updatedFormData: AirportTaxiRotationFormData) => {
    if (selectedRow === null) return;

    try {
      const airport_taxi_id = data[selectedRow]?.airport_taxi_id;
      if (airport_taxi_id !== undefined) {
        const success = await airportTaxiRotationService.updateAirportTaxiRotation(airport_taxi_id, updatedFormData);
        if (success) {
          await fetchData();
          setEditModalVisible(false);
        } else {
          console.error('Failed to update record');
        }
      }
    } catch (error) {
      console.error('Error updating record', error);
    }
  };

  const handleRowSelect = (index: number) => {
    setSelectedRow((prevSelectedRow) => (prevSelectedRow === index ? null : index));
  };

  const handleEditPress = () => {
    setEditModalVisible(true);
  };

  const handleViewPress = (index: number) => {
    setSelectedRow(index);
    setViewModalVisible(true);
  };

  useEffect(() => {
    const initAndFetch = async () => {
      try {
        await airportTaxiRotationService.initDatabase();
        await fetchData();
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };
    
    initAndFetch();
  }, []);

  return {
    modalVisible,
    setModalVisible,
    data,
    selectedRow,
    editModalVisible,
    setEditModalVisible,
    viewModalVisible,
    setViewModalVisible,
    handleFormSubmit,
    handleEditFormSubmit,
    handleRowSelect,
    handleEditPress,
    handleViewPress,
    refreshData, // Add refreshData to the returned object
  };
}

export default useAirportTaxiRotationData;
