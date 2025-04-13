import { useEffect, useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useGetUserCache from "@/hooks/user/useGetUserCache";
import useRemoveUserCache from "@/hooks/user/useRemoveUserCache";
import { useNavigation } from "@react-navigation/native";

export default function Header({ userParam = null }: any) {
  const { width, height } = useWindowDimensions();

  const navigation = useNavigation();
  const toggleDrawer = () => {
    navigation.toggleDrawer(); // This will toggle the drawer open/closed
  };

  const [user, setUser] = useState();

  const handelUserCache = async () => {
    if (!userParam) {
      const userData = await useGetUserCache();
      setUser(userData);

      if (!userData) {
        useRemoveUserCache();
      }
    } else {
      setUser(userParam);
    }
  };

  useEffect(() => {
    handelUserCache();
  }, []);

  return (
    <View style={[styles.container, { height: height * 0.09 }]}>
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <View
          style={[{ width: width * 0.15, height: width * 0.15 }, styles.img]}
        >
          <Image
            source={require("../../assets/images/icon.png")}
            style={[{ width: "100%", height: "100%" }, styles.img]}
            resizeMode="contain"
          />
        </View>
        <Text
          style={{ fontSize: width * 0.05, fontWeight: "bold", color: "#fff" }}
        >
          {user ? user.fname + " " + user.lname : "User"}
        </Text>
      </View>
      {!userParam && (
        <TouchableOpacity onPress={toggleDrawer}>
          <Ionicons name="menu" size={width * 0.09} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(24, 141, 147, 0.82)",
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  img: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(136, 181, 208, 0.82)",
  },
});
