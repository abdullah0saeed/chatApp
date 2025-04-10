import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import React from "react";
import { Link } from "expo-router";

export default function NotSIgnedIn() {
  const { width } = useWindowDimensions();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Not Signed In</Text>

      <Link
        href="/Screens/auth/Login"
        style={[
          {
            color: "#fff",
            fontSize: width * 0.06,
            fontWeight: "bold",
            textAlign: "center",
          },
          styles.btn,
        ]}
      >
        Login
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
    width: "80%",
    textAlign: "center",
  },
});
