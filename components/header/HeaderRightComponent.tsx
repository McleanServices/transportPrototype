// // HeaderRightComponent.tsx
// import React from "react";
// import { Pressable, View, Text } from "react-native";
// import { Ionicons } from "@expo/vector-icons"; // Adjust import if needed
// import { useRouter } from "expo-router"; // Or wherever router is imported from
// import { useStorageState } from "../../context/useStorageState";


// const HeaderRightComponent = () => {
//   const router = useRouter();
//   const [storedEmail] = useStorageState("email");
//   return (
//     <Pressable onPress={() => router.push("/parametres")}>
//       <View
//         style={{
//           flexDirection: "row",
//           alignItems: "center",
//           marginRight: 10,
//         }}
//       >
//         <Ionicons name="person-circle" size={24} color="black" />
//         <Text style={{ marginLeft: 5 }}>{storedEmail ? storedEmail : ""}</Text>
//       </View>
//     </Pressable>
//   );
// };

// export default HeaderRightComponent;
