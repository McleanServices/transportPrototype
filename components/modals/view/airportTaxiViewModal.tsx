// import React, { useState, useEffect } from 'react';
// import { Modal, View, Text, Button, StyleSheet } from 'react-native';
// import { router } from 'expo-router';
// import airportTaxiRotationService from '../../../app/(app)/model/airportTaxiRotationService';

// interface AirportTaxiViewModalProps {
//   modalVisible: boolean;
//   setModalVisible: (visible: boolean) => void;
//   formData: {
//     airport_taxi_id?: number;
//     exploitants: string;
//     order_number: number;
//     taxi_id: number;
//     airline_id: number;
//     destination: string;
//     passenger_count: number;
//     observations: string | null;
//     date: string;
//     airline_name: string;
//   };
//   airport_taxi_id: number;
// }

// const AirportTaxiViewModal: React.FC<AirportTaxiViewModalProps> = ({ modalVisible, setModalVisible, formData, airport_taxi_id }) => {
//   const [editData, setEditData] = useState(formData);

//   useEffect(() => {
//     const fetchRecord = async () => {
//       if (modalVisible && airport_taxi_id) {
//         try {
//           const record = await airportTaxiRotationService.getAirportTaxiRotationById(airport_taxi_id);
//           if (record) {
//             setEditData({
//               ...record,
//               airline_name: record.airline_name || '',
//             });
//           }
//         } catch (error) {
//           console.error('Error fetching record:', error);
//         }
//       }
//     };

//     fetchRecord();
//   }, [modalVisible, airport_taxi_id]);

//   return (
//     <Modal
//       animationType="slide"
//       transparent
//       visible={modalVisible}
//       onRequestClose={() => setModalVisible(false)}
//     >
//       <View style={styles.centeredView}>
//         <View style={styles.modalView}>
//           <Text style={styles.modalText}>N* D'ORDRE: {airport_taxi_id} N EXPLOITANTS: {editData.numero_exploitants}</Text>
//           <Button title="Close" onPress={() => setModalVisible(false)} />
//             <Button title="Add fiche control" onPress={() => {
//                         setModalVisible(false);
//                         router.push(`../../fiche/control?airport_taxi_rotation_id=${airport_taxi_id}`);
//                       }} />
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     width: '80%',
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//     fontSize: 20,
//   },
// });

// export default AirportTaxiViewModal;
