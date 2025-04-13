import * as FileSystem from "expo-file-system";

export default async (senderId: string, receiverId: string) => {
  try {
    const path = `${FileSystem.documentDirectory}${senderId}_${receiverId}.json`;
    const jsonValue = await FileSystem.readAsStringAsync(path).catch(
      () => null
    );

    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error retrieving data from FileSystem:", error);
    return null;
  }
};
