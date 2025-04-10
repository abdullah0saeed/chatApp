import { useState } from "react";
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

export default function Home() {
  const [showPic, setShowPic] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  const ListItem = ({ item }: any) => {
    const { width } = useWindowDimensions();

    return (
      <View
        key={item.email}
        style={{
          backgroundColor: "#fff",
          padding: 15,

          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
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
    );
  };

  return (
    <>
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

const data = [
  { email: "ahmed@ali.com", fname: "ahmed", lname: "ali", pic: "pic1" },
  {
    email: "mo@sayed",
    fname: "mo",
    lname: "sayed",
    pic: "pic2",
    new: 150,
  },
  {
    email: "ali@ahmed",
    fname: "ali",
    lname: "ahmed",
    pic: "pic3",
  },
  {
    email: "saad@khaled",
    fname: "saad",
    lname: "khaled",
    pic: "",
  },
  {
    email: "sayed@ali",
    fname: "sayed",
    lname: "ali",
    pic: "pic5",
  },
  {
    email: "ahmed@saad",
    fname: "ahmed",
    lname: "saad",
    pic: "pic6",
    new: 1,
  },
  {
    email: "ali@khaled",
    fname: "ali",
    lname: "khaled",
    pic: "pic7",
  },
  {
    email: "saad@ahmed",
    fname: "saad",
    lname: "ahmed",
    pic: "pic8",
  },
  {
    email: "hassan@zaki.com",
    fname: "hassan",
    lname: "zaki",
    pic: "pic9",
  },
  {
    email: "zaki@hassan",
    fname: "zaki",
    lname: "hassan",
    pic: "pic10",
  },
  {
    email: "ali@ahmed",
    fname: "ali",
    lname: "ahmed",
    pic: "pic11",
  },
  {
    email: "saad@khaled",
    fname: "saad",
    lname: "khaled",
    pic: "pic12",
  },
];
