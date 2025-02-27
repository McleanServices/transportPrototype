// controllers/busRotationController.ts
import busRotationService from '../model/busRotationService';
import { BusRotationData } from '../model/busRotationService';

export const fetchAllBusRotations = async (): Promise<BusRotationData[]> => {
  try {
    const rotations = await busRotationService.getAllBusRotations();
    return rotations;
  } catch (error) {
    console.error('Error fetching bus rotations:', error);
    throw error;
  }
};

export const fetchBusRotationById = async (bus_rotation_id: number): Promise<BusRotationData | null> => {
  try {
    const rotation = await busRotationService.getBusRotationById(bus_rotation_id);
    return rotation;
  } catch (error) {
    console.error(`Error fetching bus rotation with id ${bus_rotation_id}:`, error);
    throw error;
  }
};

export const createBusRotation = async (data: BusRotationData): Promise<number> => {
  try {
    const newId = await busRotationService.createBusRotation(data);
    return newId;
  } catch (error) {
    console.error('Error creating bus rotation:', error);
    throw error;
  }
};

export const updateBusRotation = async (bus_rotation_id: number, data: BusRotationData): Promise<boolean> => {
  try {
    const success = await busRotationService.updateBusRotation(bus_rotation_id, data);
    return success;
  } catch (error) {
    console.error(`Error updating bus rotation with id ${bus_rotation_id}:`, error);
    throw error;
  }
};

export const deleteBusRotation = async (bus_rotation_id: number): Promise<boolean> => {
  try {
    const success = await busRotationService.deleteBusRotation(bus_rotation_id);
    return success;
  } catch (error) {
    console.error(`Error deleting bus rotation with id ${bus_rotation_id}:`, error);
    throw error;
  }
};

export default {
  fetchAllBusRotations,
  fetchBusRotationById,
  createBusRotation,
  updateBusRotation,
  deleteBusRotation
};