import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

interface Props {
  text: string;
  isLoading: boolean;
  onPress: () => void;
}

export default function AuthButton({ text, isLoading, onPress }: Props) {
  const { width } = useWindowDimensions();
  return (
    <TouchableOpacity
      style={[styles.btn, isLoading && styles.btnDisabled]}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="large" color="white" />
      ) : (
        <Text style={[{ fontSize: width * 0.06 }, styles.btnTxt]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "rgba(13, 176, 75, 0.82)",
    borderRadius: 15,
    padding: 10,
    textAlign: "center",
    marginTop: 20,
    width: "90%",
    maxHeight: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  btnDisabled: {
    backgroundColor: "rgba(167, 210, 184, 0.82)",
  },
  btnTxt: {
    color: "white",
    fontWeight: "bold",
  },
});
