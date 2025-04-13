// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   KeyboardAvoidingView,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import React, { useEffect } from "react";
// import { useLocalSearchParams } from "expo-router";
// import { io } from "socket.io-client";

// import Header from "@/app/components/Header";
// import { FontAwesome } from "@expo/vector-icons";
// import consts from "@/consts";
// import useGetUserCache from "@/hooks/user/useGetUserCache";
// import useGetChat from "@/hooks/chats/useGetChat";

// const { BASE_URL } = consts;

// const socket = io(BASE_URL, { transports: ["websocket"] });

// export default function Chat() {
//   const { email, fname, lname, id: receiverId } = useLocalSearchParams();

//   const [height, setHeight] = React.useState(60);

//   const [sender, setSender] = React.useState({});

//   const [message, setMessage] = React.useState("");
//   const [chat, setChat] = React.useState([]);

//   useEffect(() => {
//     (async () => {
//       const user = await useGetUserCache();
//       setSender(user);
//       socket.emit("join", user.id);

//       await useGetChat(user.id, receiverId.toString()).then((data) => {
//         setChat(data);
//       });
//     })();
//   }, []);

//   useEffect(() => {
//     socket.on("receiveMessage", (data) => {
//       setChat((prev) => [...prev, data]);
//     });
//   }, [socket]);

//   // Function to dynamically adjust height of the text input
//   const handleContentSizeChange = (
//     contentWidth: number,
//     contentHeight: number
//   ) => {
//     // You can add conditions to cap the height if needed
//     setHeight(contentHeight);
//   };
//   return (
//     <View style={styles.container}>
//       <Header userParam={{ fname, lname }} />
//       <KeyboardAvoidingView style={{ flex: 1 }}>
//         <ScrollView style={[styles.chatContainer]}>
//           {chat?.map((item, index) => (
//             <View
//               style={{
//                 marginTop: 10,
//                 backgroundColor:
//                   item.senderId === sender.id ? "#fff" : "#d3d3d3",
//                 padding: 10,
//                 borderRadius: 10,
//               }}
//               key={index}
//             >
//               <Text
//                 style={{
//                   fontSize: 16,
//                   color: item.senderId === sender.id ? "#000" : "#000",
//                 }}
//               >
//                 {" "}
//                 {item.message}
//               </Text>
//             </View>
//           ))}
//         </ScrollView>
//         <View style={styles.inputContainer}>
//           <TextInput
//             placeholder="Type a message"
//             keyboardType="default"
//             autoCapitalize="none"
//             autoCorrect={false}
//             multiline
//             numberOfLines={4}
//             onContentSizeChange={handleContentSizeChange} // Dynamically adjust height
//             style={[styles.textInput, { height }]}
//             value={message}
//             onChangeText={(text) => setMessage(text)}
//           />
//           <TouchableOpacity
//             style={styles.sendBtn}
//             onPress={() => {
//               socket.emit("sendMessage", {
//                 message,
//                 senderId: sender.id,
//                 receiverId: receiverId.toString(),
//               });
//               setMessage("");
//             }}
//           >
//             <FontAwesome name="send" size={24} color="white" />
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "rgba(220, 233, 237, 0.82)",
//   },
//   chatContainer: {
//     flexGrow: 1,
//     paddingHorizontal: 5,
//     marginBottom: 10,
//   },
//   inputContainer: {
//     justifyContent: "space-between",
//     flexDirection: "row",
//     alignItems: "flex-end",
//     width: "100%",
//   },
//   textInput: {
//     minHeight: 60,
//     borderColor: "gray",
//     backgroundColor: "#fff",
//     paddingHorizontal: 10,
//     width: "82%",
//   },
//   sendBtn: {
//     width: "18%",
//     height: 60,
//     backgroundColor: "rgba(152, 187, 247, 0.82)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

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

        const chatData = await useGetChat(user.id, receiverId.toString());
        setChat(chatData);
      } catch (error) {
        console.error("Error fetching user data or chat:", error);
      }
    };

    fetchUserData();

    // Listen for incoming messages
    const handleMessage = (data) => {
      setChat((prev) => [...prev, data]);
      const oldChat = chat;
      oldChat.push(data);
      useSetChat(sender.id, receiverId.toString(), oldChat);
    };
    socket.on("receiveMessage", handleMessage);

    // Cleanup function
    return () => {
      socket.off("receiveMessage", handleMessage);
      socket.disconnect();
    };
  }, [receiverId]);

  // Dynamically adjust height of the text input
  const handleContentSizeChange = (contentWidth, contentHeight) => {
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
                  timestamp: Date.now(),
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
const MessageBubble = ({ message, senderId }) => {
  const isSender = message.senderId === senderId;
  return (
    <View
      style={{
        marginTop: 15,
        backgroundColor: isSender ? "#fff" : "rgba(169, 210, 167, 0.82)",
        padding: 10,
        borderRadius: 10,
        alignSelf: isSender ? "flex-end" : "flex-start",
      }}
    >
      <Text style={{ fontSize: 16, color: "#000" }}>{message.message}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "baseline",
          marginTop: 5,
        }}
      >
        <Text style={{ fontSize: 12, color: "#888", marginTop: 5 }}>
          {new Date(message.timestamp).toLocaleString().split(",")[0] +
            " " +
            new Date(message.timestamp).toLocaleString().slice(-11, -6) +
            " " +
            new Date(message.timestamp).toLocaleString().slice(-2)}
        </Text>
        {isSender && (
          <View
            style={{
              marginLeft: 5,
              backgroundColor: !message.seen
                ? "#ccc"
                : "rgba(28, 156, 242, 0.82)",
              width: 10,
              height: 10,
              borderRadius: 50,
            }}
          />
        )}
      </View>
      <View
        style={[
          styles.bubbleArrow,
          isSender ? styles.bubbleArrowRight : styles.bubbleArrowLeft,
        ]}
      />
    </View>
  );
};

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
  bubbleArrowRight: {
    right: 5,
    borderTopWidth: 10,
    borderTopColor: "transparent",
    borderLeftWidth: 10,
    borderLeftColor: "transparent",
    borderRightWidth: 10,
    borderRightColor: "#fff",
    borderBottomWidth: 10,
    borderBottomColor: "transparent",
  },
  bubbleArrowLeft: {
    left: 5,
    borderTopWidth: 10,
    borderTopColor: "transparent",
    borderLeftWidth: 10,
    borderLeftColor: "rgba(169, 210, 167, 0.82)",
    borderRightWidth: 10,
    borderRightColor: "transparent",
    borderBottomWidth: 10,
    borderBottomColor: "transparent",
  },
});
