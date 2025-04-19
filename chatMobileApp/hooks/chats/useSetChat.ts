import * as FileSystem from "expo-file-system";

export default async (senderId: string, receiverId: string, chat: []) => {
  try {
    const path = `${FileSystem.documentDirectory}${senderId}_${receiverId}.json`;
    await FileSystem.writeAsStringAsync(path, JSON.stringify(chat));
  } catch (error) {
    console.error("Error saving data to FileSystem:", error);
  }
};
