import { useState, useEffect } from 'react';
import busRotationService from '../services/busRotationService';

export interface BusRotationFormData {
  bus_rotation_id?: number;
  numero_exploitants: string;
  order_number: number;
  bus_type_id: number;
  date: string;
  arrival_time: string;
  departure_time: string | null;
  passenger_count: number;
  observations: string | null;
  created_at?: string;
}

export function useBusRotationData() {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<BusRotationFormData[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const records = await busRotationService.getAllBusRotations();
      setData(records);
    } catch (error) {
      console.error('Error fetching data from database', error);
      setData([]);
    }
  };

  const refreshData = async () => {
    await fetchData();
  };

  const handleFormSubmit = async (newFormData: BusRotationFormData) => {
    try {
      const newId = await busRotationService.createBusRotation(newFormData);
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

  const handleEditFormSubmit = async (updatedFormData: BusRotationFormData) => {
    if (selectedRow === null) return;

    try {
      const bus_rotation_id = data[selectedRow]?.bus_rotation_id;
      if (bus_rotation_id !== undefined) {
        const success = await busRotationService.updateBusRotation(bus_rotation_id, updatedFormData);
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
        await busRotationService.initDatabase();
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

export default useBusRotationData;