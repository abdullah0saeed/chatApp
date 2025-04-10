import { useEffect } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import * as ScreenCapture from "expo-screen-capture";

export default function ShowPicture({ pic, onClose, name }: any) {
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    const prevent = async () => {
      await ScreenCapture.preventScreenCaptureAsync();
    };

    prevent();

    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View
        style={{
          width: width,
          height: height,
          backgroundColor: "rgba(0, 0, 0, 0.7)",

          alignItems: "center",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            marginTop: height * 0.1,
          }}
        >
          <Text
            style={{
              fontSize: width * 0.07,
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            {name.toUpperCase()}
          </Text>
          <View
            style={{
              width: width * 0.9,
              height: width * 0.9,
              backgroundColor: "#fff",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              elevation: 5,
            }}
          >
            <Image
              source={pic}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
                borderRadius: 10,
              }}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
