import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  StyleSheet,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useFocusEffect, useNavigation } from "expo-router";
import { io } from "socket.io-client";

import Header from "@/app/components/Header";
import ShowPicture from "@/app/components/ShowPicture";
import { getAllUsers } from "@/app/requests/userRequests";
import useGetUserCache from "@/hooks/user/useGetUserCache";
import imageHolder from "../../../assets/images/myLogo.png";
import consts from "@/consts";

const socket = io(consts.BASE_URL, { transports: ["websocket"] });

export default function Home() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const [showPic, setShowPic] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getData = async () => {
    setRefreshing(true);
    try {
      const user = await useGetUserCache();
      const usersData = await getAllUsers(user.id);
      setData(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  const handleNavigation = useCallback(
    (item: any) => {
      navigation.navigate("Chat", {
        email: item.email,
        fname: item.fname,
        lname: item.lname,
        id: item._id,
        pic: item.pic || imageHolder,
      });
    },
    [navigation]
  );

  const handleImagePress = useCallback((item) => {
    if (item.pic) {
      setSelectedItem(item);
      setShowPic(true);
    }
  }, []);

  const ListItem = useCallback(
    ({ item }: any) => (
      <TouchableOpacity
        onPress={() => handleNavigation(item)}
        style={styles.itemWrapper}
      >
        <View style={styles.itemContainer}>
          <TouchableOpacity
            style={[
              styles.avatar,
              {
                width: width * 0.15,
                height: width * 0.15,
                borderRadius: width * 0.075,
              },
            ]}
            disabled={!item.pic}
            onPress={() => handleImagePress(item)}
          >
            {item.pic ? (
              <Image
                source={item.pic}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={[styles.avatarText, { fontSize: width * 0.07 }]}>
                {item.fname[0].toUpperCase()}
                {item.lname[0].toUpperCase()}
              </Text>
            )}
          </TouchableOpacity>

          <View>
            <Text style={[styles.name, { fontSize: width * 0.05 }]}>
              {item.fname} {item.lname}
            </Text>
          </View>

          {item.newMsgs && item.newMsgs != 0 && (
            <View
              style={[
                styles.badge,
                {
                  width: width * 0.075,
                  height: width * 0.075,
                  borderRadius: width * 0.0375,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    fontSize: item.newMsgs < 99 ? width * 0.04 : width * 0.035,
                  },
                ]}
              >
                {item.newMsgs > 99 ? "99+" : item.newMsgs}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    ),
    [width, handleNavigation, handleImagePress]
  );

  return (
    <>
      <Header />
      <FlashList
        data={data}
        renderItem={({ item }) => <ListItem item={item} />}
        estimatedItemSize={100}
        keyExtractor={(item) => item.email}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={getData}
      />
      {showPic && selectedItem && (
        <ShowPicture
          pic={selectedItem.pic}
          onClose={() => {
            setShowPic(false);
            setSelectedItem(null);
          }}
          name={`${selectedItem.fname} ${selectedItem.lname}`}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "rgba(99, 109, 106, 0.46)",
  },
  avatar: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },
  name: {
    fontWeight: "bold",
  },
  badge: {
    backgroundColor: "rgba(240, 86, 114, 0.93)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 20,
    borderWidth: 2,
    borderColor: "rgba(237, 163, 177, 0.93)",
    elevation: 5,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
