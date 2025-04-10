import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useReducer } from "react";
import { Link, router } from "expo-router";
import { loginUser } from "@/app/requests/userRequests";
import useSetUserCache from "@/hooks/user/useSetUserCache";
import AuthProvider from "./providers/AuthProvider";
import useRemoveUserCache from "@/hooks/user/useRemoveUserCache";

export default function Login() {
  const { width, height } = useWindowDimensions();

  const [isLoading, setIsLoading] = React.useState(false);

  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case "SET_USERNAME":
        return { ...state, username: action.payload.trim() };
      case "SET_PASSWORD":
        return { ...state, password: action.payload.trim() };
      case "RESET":
        return { ...state, username: "", password: "" };
      default:
        return state;
    }
  };
  const initialState = {
    username: "",
    password: "",
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const handleLogin = async () => {
    setIsLoading(true);
    if (!state.username || !state.password) {
      setIsLoading(false);
      return alert("Please fill in all fields");
    }

    try {
      const res = await loginUser({
        username: state.username,
        password: state.password,
      });

      setIsLoading(false);

      if (res) {
        useSetUserCache({
          fname: res.fname,
          lname: res.lname,
          email: res.email,
          username: res.username,
          isSignedIn: true,
          isVerified: res.isVerified,
          isAdmin: res.isAdmin,
        });

        router.replace("/Screens/UI");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <AuthProvider>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <View
              style={[
                {
                  width: width * 0.85,
                  height: height * 0.5,
                },
                styles.box,
              ]}
            >
              <Text style={[{ fontSize: width * 0.07 }, styles.header]}>
                Login to your account
              </Text>
              <TextInput
                placeholder="Username | Email"
                placeholderTextColor={"rgba(146, 191, 170, 0.91)"}
                style={[
                  {
                    width: width * 0.85,
                    height: height * 0.08,
                    fontSize: width * 0.05,
                  },
                  styles.input,
                ]}
                value={state.username}
                onChangeText={(text) =>
                  dispatch({ type: "SET_USERNAME", payload: text })
                }
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor={"rgba(146, 191, 170, 0.91)"}
                secureTextEntry={true}
                style={[
                  {
                    width: width * 0.85,
                    height: height * 0.08,
                    fontSize: width * 0.05,
                  },
                  styles.input,
                ]}
                value={state.password}
                onChangeText={(text) =>
                  dispatch({ type: "SET_PASSWORD", payload: text })
                }
              />
              <TouchableOpacity style={styles.btn} onPress={handleLogin}>
                {!isLoading ? (
                  <Text style={[{ fontSize: width * 0.06 }, styles.btnTxt]}>
                    Login
                  </Text>
                ) : (
                  <ActivityIndicator
                    size="large"
                    color="white"
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
              </TouchableOpacity>
              <Text
                style={[
                  { fontSize: width * 0.05, marginTop: height * 0.02 },
                  styles.registerTxt,
                ]}
              >
                Don't have an account?{" "}
                <Link
                  href="/Screens/auth/Signup"
                  style={{
                    color: "rgba(227, 142, 14, 0.93)",
                    fontWeight: "bold",
                  }}
                >
                  Register
                </Link>
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  box: { justifyContent: "center", alignItems: "center" },
  input: {
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 20,
    borderRadius: 15,
    padding: 10,
    textAlign: "center",
    textAlignVertical: "center",
    backgroundColor: "white",
    color: "rgba(39, 96, 69, 0.91)",
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "rgba(13, 176, 75, 0.82)",
    borderRadius: 15,
    padding: 10,
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: 20,
    borderColor: "#fff",
    width: "90%",
  },
  btnTxt: {
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    fontWeight: "bold",
  },
  header: {
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    textAlignVertical: "center",
    color: "rgba(19, 135, 63, 0.82)",
  },
  registerTxt: {
    textAlign: "center",
    textAlignVertical: "center",
    color: "rgba(7, 71, 53, 0.82)",
  },
});
