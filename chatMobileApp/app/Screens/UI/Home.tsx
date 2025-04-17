import { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import {
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import ShowPicture from "@/app/components/ShowPicture";
import imageHolder from "../../../assets/images/react-logo.png";
import { useNavigation, useRouter } from "expo-router";
import Header from "@/app/components/Header";
import { getAllUsers } from "@/app/requests/userRequests";
import useGetUserCache from "@/hooks/user/useGetUserCache";

export default function Home() {
  const navigation = useNavigation();

  const [showPic, setShowPic] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [data, setData] = useState([]);

  // get all users
  useEffect(() => {
    const getData = async () => {
      await useGetUserCache().then(async (user) => {
        const data = await getAllUsers(user.id);

        setData(data);
      });
    };
    getData();
  }, []);

  const ListItem = ({ item }: any) => {
    const { width } = useWindowDimensions();

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate({
            name: "Chat",
            params: {
              email: item.email,
              fname: item.fname,
              lname: item.lname,
              id: item._id,
            },
          });
        }}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            padding: 15,

            flexDirection: "row",
            alignItems: "center",
            borderWidth: 0.5,
            borderColor: "rgba(99, 109, 106, 0.46)",
          }}
        >
          <TouchableOpacity
            style={{
              width: width * 0.15,
              height: width * 0.15,
              borderRadius: width * 0.075,
              backgroundColor: "#ccc",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 15,
            }}
            disabled={!item.pic}
            onPress={() => {
              if (item.pic) {
                setSelectedItem(item);
                setShowPic(true);
              }
            }}
          >
            {!item.pic ? (
              <Text
                style={{
                  fontSize: width * 0.07,
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                {item.fname[0].toUpperCase() + item.lname[0].toUpperCase()}
              </Text>
            ) : (
              <Image
                source={imageHolder}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                resizeMode="contain"
                alt={`${item.fname[0]} ${item.lname[0]}`}
              />
            )}
          </TouchableOpacity>

          <View>
            <Text
              style={{ fontSize: width * 0.05, fontWeight: "bold" }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >{`${item.fname} ${item.lname}`}</Text>
            {/* <Text>{item.email}</Text> */}
          </View>
          {item.new && (
            <View
              style={{
                backgroundColor: "rgba(240, 86, 114, 0.93)",
                borderRadius: width * 0.0375,
                width: width * 0.075,
                height: width * 0.075,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                right: 20,
                borderWidth: 2,
                borderColor: "rgba(237, 163, 177, 0.93)",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: item.new < 99 ? width * 0.04 : width * 0.035,
                  fontWeight: "bold",
                }}
              >
                {item.new > 99 ? "99+" : item.new}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Header />
      <FlashList
        data={data}
        renderItem={({ item }) => <ListItem item={item} />}
        estimatedItemSize={1}
        keyExtractor={(item) => item.email}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
      {showPic && (
        <ShowPicture
          pic={imageHolder}
          onClose={() => {
            setShowPic(false);
            setSelectedItem("");
          }}
          name={selectedItem.fname + " " + selectedItem.lname}
        />
      )}
    </>
  );
}
