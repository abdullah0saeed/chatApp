import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { io } from "socket.io-client";

import Header from "@/app/components/Header";
import consts from "@/consts";
import useGetUserCache from "@/hooks/user/useGetUserCache";
import useGetChat from "@/hooks/chats/useGetChat";
import { useLocalSearchParams } from "expo-router";
import useSetChat from "@/hooks/chats/useSetChat";
import { getMessages } from "@/app/requests/messagesRequests";
import MessageBubble from "@/app/components/MessageBubble";

const { BASE_URL } = consts;

const socket = io(BASE_URL, { transports: ["websocket"] });

export default function Chat() {
  const { email, fname, lname, id: receiverId } = useLocalSearchParams();
  const [height, setHeight] = useState(60);
  const [sender, setSender] = useState({});
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([{}]);

  const scrollRef = React.useRef();

  // Initialize socket connection
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await useGetUserCache();
        setSender(user);

        socket.emit("join", user.id);

        let chatData = [];
        const cachedChat = await useGetChat(user.id, receiverId.toString());
        if (cachedChat) chatData = cachedChat;

        useSetChat(user.id, receiverId.toString(), chatData);

        setChat(chatData);
      } catch (error) {
        console.error("Error fetching user data or chat:", error);
      }
    };

    fetchUserData();

    // Listen for incoming messages
    const handleMessage = async (data: any) => {
      const sender = await useGetUserCache();

      if (data.senderId === sender.id) return;

      data.seen = true;

      // Mark the message as seen and notify the sender
      socket.emit("messageSeen", {
        senderId: data.senderId,
        receiverId: data.receiverId,
        messageId: data.timestamp, // Use the timestamp as a unique identifier
      });

      setChat((prev) => [...prev, data]);
      const newChat = [...chat];
      newChat.push(data);
      useSetChat(sender.id, receiverId.toString(), [...newChat]);
    };
    socket.on("receiveMessage", handleMessage);

    // Cleanup function
    return () => {
      socket.off("receiveMessage", handleMessage);
      // socket.disconnect();
    };
  }, [receiverId]);

  useEffect(() => {
    (async () => {
      const user = await useGetUserCache();

      const resMessages = await getMessages(user.id, receiverId.toString());

      let chatData = await useGetChat(user.id, receiverId.toString());

      resMessages.receivedMessages.forEach((msg) => {
        if (!msg.seen) {
          chatData.push(msg);
        }
      });

      resMessages.sentMessages.forEach((msg) => {
        if (msg.seen) {
          const found = chatData.find((m) => m.timestamp === msg.timestamp);
          if (found) found.seen = true;
        }
      });

      useSetChat(user.id, receiverId.toString(), chatData);
      setChat(chatData);
    })();
  }, []);

  useEffect(() => {
    const handleUpdateMessageSeen = (messageId) => {
      setChat((prev) =>
        prev.map((msg) =>
          msg.timestamp === messageId ? { ...msg, seen: true } : msg
        )
      );
    };

    socket.on("updateMessageSeen", handleUpdateMessageSeen);

    return () => {
      socket.off("updateMessageSeen", handleUpdateMessageSeen);
    };
  }, []);

  // Dynamically adjust height of the text input
  const handleContentSizeChange = (_, contentHeight: number) => {
    setHeight(Math.min(contentHeight, 120)); // Cap the height at 120
  };

  return (
    <View style={styles.container}>
      <Header userParam={{ fname, lname }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.chatContainer}
          ref={scrollRef}
          onContentSizeChange={() =>
            scrollRef.current.scrollToEnd({
              animated: true,
              behavior: "smooth",
            })
          }
          onLayout={() =>
            scrollRef.current.scrollToEnd({
              animated: true,
              behavior: "smooth",
            })
          }
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {chat?.map((item, index) => (
            <MessageBubble key={index} message={item} senderId={sender.id} />
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type a message"
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
            multiline
            numberOfLines={4}
            onContentSizeChange={({ nativeEvent }) =>
              handleContentSizeChange(
                nativeEvent.contentSize.width,
                nativeEvent.contentSize.height
              )
            }
            style={[styles.textInput, { height }]}
            value={message}
            onChangeText={setMessage}
            accessibilityLabel="Message Input"
          />
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={() => {
              if (message.trim()) {
                const newMessage = {
                  message,
                  senderId: sender.id,
                  receiverId: receiverId.toString(),
                  timestamp: new Date().toISOString(),
                  seen: false,
                };

                let oldChat = chat ? [...chat] : [];

                oldChat.push(newMessage);
                setChat(oldChat);

                useSetChat(sender.id, receiverId.toString(), oldChat);

                socket.emit("sendMessage", newMessage);

                setMessage("");
              }
            }}
            accessibilityLabel="Send Message"
          >
            <FontAwesome name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// Reusable MessageBubble Component

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(220, 233, 237, 0.82)",
  },
  chatContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 5,
    paddingBottom: 5,
  },
  textInput: {
    minHeight: 60,
    borderColor: "gray",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 10,
    width: "82%",
  },
  sendBtn: {
    width: "17%",
    height: 60,
    backgroundColor: "rgba(152, 187, 247, 0.82)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  bubbleArrow: {
    position: "absolute",
    bottom: -10,

    width: 0,
    height: 0,
  },
});
