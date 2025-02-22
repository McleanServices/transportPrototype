import { useState, useEffect } from 'react';
import databaseService from '../(app)/services/databaseService';

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
  };

  const handleFormSubmit = async (newFormData: TransportFormData) => {
    try {
      const newId = await databaseService.createTransportRecord(newFormData);
      newFormData.id = newId;
      setData((prevData) => [...prevData, newFormData]);
    } catch (error) {
      console.error('Error creating new record', error);
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

  useEffect(() => {
    if (data.some(item => !item.id)) {
      fetchData();
    }
  }, [data]);

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
  };
}
