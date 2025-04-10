import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useRemoveUserCache() {
  try {
    // Remove user data from AsyncStorage
    AsyncStorage.removeItem("userCache");
  } catch (error) {
    console.error("Error removing user cache:", error);
  }
}
