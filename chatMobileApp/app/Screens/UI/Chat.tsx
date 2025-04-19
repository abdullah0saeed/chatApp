import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { io } from "socket.io-client";
import { useLocalSearchParams } from "expo-router";

import Header from "@/app/components/Header";
import MessageBubble from "@/app/components/MessageBubble";
import consts from "@/consts";
import useGetUserCache from "@/hooks/user/useGetUserCache";
import useGetChat from "@/hooks/chats/useGetChat";
import useSetChat from "@/hooks/chats/useSetChat";
import { getMessages } from "@/app/requests/messagesRequests";

const socket = io(consts.BASE_URL, { transports: ["websocket"] });

export default function Chat() {
  const { email, fname, lname, id: receiverId } = useLocalSearchParams();
  const scrollRef = useRef<ScrollView>(null);

  const [height, setHeight] = useState(60);
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState<any>({});
  const [chat, setChat] = useState<any[]>([]);

  // Send message
  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      message,
      senderId: sender.id,
      receiverId: receiverId.toString(),
      timestamp: new Date().toISOString(),
      seen: false,
    };

    const updatedChat = [...chat, newMessage];
    setChat(updatedChat);
    useSetChat(sender.id, receiverId.toString(), updatedChat);
    socket.emit("sendMessage", newMessage);
    setMessage("");
  };

  // Initial load
  useEffect(() => {
    const initChat = async () => {
      try {
        const user = await useGetUserCache();
        setSender(user);
        socket.emit("join", user.id);

        const cachedChat = await useGetChat(user.id, receiverId.toString());
        setChat(cachedChat || []);
        // useSetChat(user.id, receiverId.toString(), cachedChat || []);

        const resMessages = await getMessages(user.id, receiverId.toString());
        const mergedChat = [...(cachedChat || [])];

        resMessages.receivedMessages.forEach((msg) => {
          const existingMessage = mergedChat.find(
            (m) => m.timestamp === msg.timestamp
          );
          if (existingMessage) return;
          if (!msg.seen) mergedChat.push(msg);

          // Emit seen acknowledgment to the sender
          socket.emit("messageSeen", {
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            messageId: msg.timestamp,
          });
        });

        resMessages.sentMessages.forEach((msg) => {
          const index = mergedChat.findIndex(
            (m) => m.timestamp === msg.timestamp
          );
          if (index !== -1) mergedChat[index].seen = true;
        });

        useSetChat(user.id, receiverId.toString(), mergedChat);
        setChat(mergedChat);
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    initChat();
  }, [receiverId]);

  // Incoming messages
  useEffect(() => {
    const onReceiveMessage = async (resData: any) => {
      const user = await useGetUserCache();
      if (resData.senderId === user.id) return;

      resData.seen = true;
      socket.emit("messageSeen", {
        senderId: resData.senderId,
        receiverId: resData.receiverId,
        messageId: resData.timestamp,
      });

      const updatedChat = [...chat, resData];
      setChat(updatedChat);
      useSetChat(user.id, receiverId.toString(), updatedChat);
    };

    socket.on("receiveMessage", onReceiveMessage);
    return () => socket.off("receiveMessage", onReceiveMessage);
  }, [chat]);

  // Seen updates
  useEffect(() => {
    const onSeenUpdate = (messageId: string) => {
      setChat((prev) =>
        prev.map((msg) =>
          msg.timestamp === messageId ? { ...msg, seen: true } : msg
        )
      );
    };

    socket.on("updateMessageSeen", onSeenUpdate);
    return () => socket.off("updateMessageSeen", onSeenUpdate);
  }, []);

  return (
    <View style={styles.container}>
      <Header userParam={{ fname, lname }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.chatContainer}
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => scrollRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        >
          {chat.map((msg, index) => (
            <MessageBubble key={index} message={msg} senderId={sender.id} />
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type a message"
            value={message}
            onChangeText={setMessage}
            multiline
            style={[styles.textInput, { height }]}
            onContentSizeChange={(e) =>
              setHeight(Math.min(e.nativeEvent.contentSize.height, 120))
            }
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
            <FontAwesome name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

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
});
