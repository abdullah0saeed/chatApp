import AsyncStorage from "@react-native-async-storage/async-storage";

export default async (userData: any) => {
  try {
    const userCache = await AsyncStorage.getItem("userCache");
    const parsedUserCache = userCache ? JSON.parse(userCache) : null;

    if (parsedUserCache) {
      const updatedUserCache = { ...parsedUserCache, ...userData };
      await AsyncStorage.setItem("userCache", JSON.stringify(updatedUserCache));
    } else {
      console.error("No user cache found to update.");
    }
  } catch (error) {
    console.error("Error updating user cache:", error);
  }
};
