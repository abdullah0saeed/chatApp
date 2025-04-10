import AsyncStorage from "@react-native-async-storage/async-storage";

export default async () => {
  try {
    const userCache = await AsyncStorage.getItem("userCache");
    return userCache ? JSON.parse(userCache) : null;
  } catch (error) {
    console.error("Error retrieving user cache:", error);
    return null;
  }
};
