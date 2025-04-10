import AsyncStorage from "@react-native-async-storage/async-storage";

export default async (userCache: {
  fname: string;
  lname: string;
  email: string;
  username: string;
  isSignedIn: boolean;
  isVerified: boolean;
  isAdmin: boolean;
}) => {
  try {
    await AsyncStorage.setItem("userCache", JSON.stringify(userCache));
  } catch (error) {
    console.error("Error saving user cache:", error);
  }
};
