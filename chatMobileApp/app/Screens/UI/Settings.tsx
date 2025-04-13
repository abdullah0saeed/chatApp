import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import useRemoveUserCache from "@/hooks/user/useRemoveUserCache";
import { router } from "expo-router";

export default function Settings() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => {
          useRemoveUserCache();
          router.replace("/");
        }}
      >
        <FontAwesome name="sign-out" size={28} color="#fff" />
        <Text style={styles.btnTxt}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  logoutBtn: {
    backgroundColor: "rgba(234, 56, 59, 0.82)",
    width: "80%",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  btnTxt: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
