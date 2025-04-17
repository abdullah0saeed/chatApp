import consts from "../../consts";

const { BASE_URL } = consts;

export const getMessages = async (user1Id: string, user2Id: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/messages/getUnseen/${user1Id}/${user2Id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return console.log(data.message || "Failed to get messages");
    }

    return data.messages;
  } catch (error) {
    console.error("Error getting messages:", error);
    return null;
  }
};
