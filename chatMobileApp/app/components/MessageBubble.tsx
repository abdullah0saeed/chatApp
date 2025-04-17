import { StyleSheet, Text, View } from "react-native";

export default function MessageBubble({ message, senderId }) {
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
          {new Date(message.timestamp).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }) +
            "   " +
            new Date(message.timestamp).toLocaleString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
        </Text>
        {isSender && (
          <View
            style={{
              marginLeft: 5,
              backgroundColor: !message.seen
                ? "#ccc"
                : "rgba(28, 156, 242, 0.82)",
              borderWidth: 1,
              borderColor: !message.seen ? "#ccc" : "rgba(12, 238, 117, 0.81)",
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
}

const styles = StyleSheet.create({
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
