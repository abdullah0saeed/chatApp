import Header from "@/app/components/Header";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { useWindowDimensions } from "react-native";
import Settings from "./Settings";
import index from ".";
import News from "./News";

const Drawer = createDrawerNavigator();

export default () => {
  const { width } = useWindowDimensions();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: "right",
        drawerContentStyle: {
          width: width * 0.8,
          alignSelf: "center",
          paddingTop: 50,
          gap: 20,
        },
        drawerLabelStyle: {
          fontSize: width * 0.05,
          color: "#000",
        },
      }}
    >
      <Drawer.Screen
        name="index"
        component={index}
        options={{
          drawerLabel: "Chats",
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="News"
        component={News}
        options={{
          headerShown: true,
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: true,
        }}
      />
    </Drawer.Navigator>
  );
};
