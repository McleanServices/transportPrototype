import { useState, useEffect } from 'react';
import databaseService from './databaseService';

export interface TransportFormData {
  id?: number;
  exploitants: string;
  arrivalTime: string;
  departureTime: string | null;
  passengers: string | null;
  observations: string | null;
  order?: number;
}



export function useTransportData() {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<TransportFormData[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const records = await databaseService.getAllTransportRecords();
      setData(records);
    } catch (error) {
      console.error('Error fetching data from database', error);
      setData([]);
    }
    try {
      const tableNames = await databaseService.getAllTableNames();
      console.log('Tables in the database:', tableNames);
    } catch (error) {
      console.error('Error fetching table names:', error);
    }
  };

  const refreshData = async () => {
    await fetchData();
  };

  const handleFormSubmit = async (newFormData: TransportFormData) => {
    try {
      const newId = await databaseService.createTransportRecord(newFormData);
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

  const handleEditFormSubmit = async (updatedFormData: TransportFormData) => {
    if (selectedRow === null) return;

    try {
      const id = data[selectedRow]?.id;
      if (id !== undefined) {
        const success = await databaseService.updateTransportRecord(id, updatedFormData);
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
        await databaseService.initDatabase();
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

export default useTransportData;
