// // controllers/airportTaxiRotationController.ts
// import airportTaxiRotationService from '../model/airportTaxiRotationService';
// import { AirportTaxiRotationData } from '../model/airportTaxiRotationService';

// export const fetchAllAirportTaxiRotations = async (): Promise<AirportTaxiRotationData[]> => {
//   try {
//     const rotations = await airportTaxiRotationService.getAllAirportTaxiRotations();
//     return rotations;
//   } catch (error) {
//     console.error('Error fetching airport taxi rotations:', error);
//     throw error;
//   }
// };

// export const fetchAirportTaxiRotationById = async (airport_taxi_id: number): Promise<AirportTaxiRotationData | null> => {
//   try {
//     const rotation = await airportTaxiRotationService.getAirportTaxiRotationById(airport_taxi_id);
//     return rotation;
//   } catch (error) {
//     console.error(`Error fetching airport taxi rotation with id ${airport_taxi_id}:`, error);
//     throw error;
//   }
// };

// export const createAirportTaxiRotation = async (data: AirportTaxiRotationData): Promise<number> => {
//   try {
//     const newId = await airportTaxiRotationService.createAirportTaxiRotation(data);
//     return newId;
//   } catch (error) {
//     console.error('Error creating airport taxi rotation:', error);
//     throw error;
//   }
// };

// export const updateAirportTaxiRotation = async (airport_taxi_id: number, data: AirportTaxiRotationData): Promise<boolean> => {
//   try {
//     const success = await airportTaxiRotationService.updateAirportTaxiRotation(airport_taxi_id, data);
//     return success;
//   } catch (error) {
//     console.error(`Error updating airport taxi rotation with id ${airport_taxi_id}:`, error);
//     throw error;
//   }
// };

// export const deleteAirportTaxiRotation = async (airport_taxi_id: number): Promise<boolean> => {
//   try {
//     const success = await airportTaxiRotationService.deleteAirportTaxiRotation(airport_taxi_id);
//     return success;
//   } catch (error) {
//     console.error(`Error deleting airport taxi rotation with id ${airport_taxi_id}:`, error);
//     throw error;
//   }
// };

// // Additional utility functions specific to airport taxi rotations can be added here
// export const getAirlineName = async (airline_id: number): Promise<string | null> => {
//   try {
//     // This would require adding a method to the service
//     const rotation = await airportTaxiRotationService.getAirportTaxiRotationById(airline_id);
//     return rotation?.airline_name || null;
//   } catch (error) {
//     console.error(`Error fetching airline name for id ${airline_id}:`, error);
//     return null;
//   }
// };

// export default {
//   fetchAllAirportTaxiRotations,
//   fetchAirportTaxiRotationById,
//   createAirportTaxiRotation,
//   updateAirportTaxiRotation,
//   deleteAirportTaxiRotation,
//   getAirlineName
// };

