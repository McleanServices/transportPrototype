// import marigotTaxiRotationService from '../model/marigotTaxiRotationService';
// import { MarigotTaxiRotationData } from '../model/marigotTaxiRotationService';

// export const fetchAllMarigotTaxiRotations = async (): Promise<MarigotTaxiRotationData[]> => {
//   try {
//     const rotations = await marigotTaxiRotationService.getAllMarigotTaxiRotations();
//     return rotations;
//   } catch (error) {
//     console.error('Error fetching marigot taxi rotations:', error);
//     throw error;
//   }
// };

// export const fetchMarigotTaxiRotationById = async (marigot_taxi_id: number): Promise<MarigotTaxiRotationData | null> => {
//   try {
//     const rotation = await marigotTaxiRotationService.getMarigotTaxiRotationById(marigot_taxi_id);
//     return rotation;
//   } catch (error) {
//     console.error(`Error fetching marigot taxi rotation with id ${marigot_taxi_id}:`, error);
//     throw error;
//   }
// };

// export const createMarigotTaxiRotation = async (data: MarigotTaxiRotationData): Promise<number> => {
//   try {
//     const newId = await marigotTaxiRotationService.createMarigotTaxiRotation(data);
//     return newId;
//   } catch (error) {
//     console.error('Error creating marigot taxi rotation:', error);
//     throw error;
//   }
// };

// export const updateMarigotTaxiRotation = async (marigot_taxi_id: number, data: MarigotTaxiRotationData): Promise<boolean> => {
//   try {
//     const success = await marigotTaxiRotationService.updateMarigotTaxiRotation(marigot_taxi_id, data);
//     return success;
//   } catch (error) {
//     console.error(`Error updating marigot taxi rotation with id ${marigot_taxi_id}:`, error);
//     throw error;
//   }
// };

// export const deleteMarigotTaxiRotation = async (marigot_taxi_id: number): Promise<boolean> => {
//   try {
//     const success = await marigotTaxiRotationService.deleteMarigotTaxiRotation(marigot_taxi_id);
//     return success;
//   } catch (error) {
//     console.error(`Error deleting marigot taxi rotation with id ${marigot_taxi_id}:`, error);
//     throw error;
//   }
// };

// export default {
//   fetchAllMarigotTaxiRotations,
//   fetchMarigotTaxiRotationById,
//   createMarigotTaxiRotation,
//   updateMarigotTaxiRotation,
//   deleteMarigotTaxiRotation
// };
