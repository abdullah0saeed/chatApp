import { StyleSheet, TextInput, useWindowDimensions } from "react-native";

interface Props {
  placeHolder: string;
  value: string;
  onChangeText: (text: string) => void;
  otherProps?: any;
}

export default function AuthInputField({
  placeHolder,
  value,
  onChangeText,
  otherProps,
}: Props) {
  const { width, height } = useWindowDimensions();
  const inputStyle = {
    width: width * 0.85,
    height: height * 0.08,
    fontSize: width * 0.05,
  };
  return (
    <TextInput
      placeholder={placeHolder}
      placeholderTextColor="rgba(146, 191, 170, 0.91)"
      autoCapitalize="none"
      style={[inputStyle, styles.input]}
      value={value}
      onChangeText={onChangeText}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 20,
    borderRadius: 15,
    padding: 10,
    textAlign: "center",
    backgroundColor: "white",
    color: "rgba(39, 96, 69, 0.91)",
    fontWeight: "bold",
  },
});
