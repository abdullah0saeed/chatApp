import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  Pressable,
  Touchable,
} from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { signupUser } from "@/app/requests/userRequests";
import useSetUserCache from "@/hooks/user/useSetUserCache";

export default function Signup() {
  const { width, height } = useWindowDimensions();

  const reducer = (state: any, action: { type: string; payload: any }) => {
    switch (action.type) {
      case "SET_EMAIL":
        return { ...state, email: action.payload.trim() };
      case "SET_USERNAME":
        return { ...state, username: action.payload.trim() };
      case "SET_FNAME":
        return { ...state, fname: action.payload.trim() };
      case "SET_LNAME":
        return { ...state, lname: action.payload.trim() };
      case "SET_PASSWORD":
        return { ...state, password: action.payload.trim() };
      case "SET_CONFIRM_PASSWORD":
        return { ...state, confirmPassword: action.payload.trim() };
      case "RESET":
        return {
          ...state,
          email: "",
          username: "",
          fname: "",
          lname: "",
          password: "",
          confirmPassword: "",
        };
      case "SET_IS_LOADING":
        return { ...state, isLoading: action.payload };
      default:
        return state;
    }
  };
  const initialState = {
    email: "",
    username: "",
    fname: "",
    lname: "",
    password: "",
    confirmPassword: "",
    isLoading: false,
  };
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const handleRegister = () => {
    dispatch({ type: "SET_IS_LOADING", payload: true });
    if (
      !state.username ||
      !state.password ||
      !state.confirmPassword ||
      !state.email ||
      !state.fname ||
      !state.lname
    ) {
      dispatch({ type: "SET_IS_LOADING", payload: false });
      return alert("Please fill in all fields");
    }
    if (state.password !== state.confirmPassword) {
      dispatch({ type: "SET_IS_LOADING", payload: false });
      return alert("Passwords do not match");
    }
    if (state.password.length < 6) {
      dispatch({ type: "SET_IS_LOADING", payload: false });
      return alert("Password must be at least 6 characters long");
    }

    signupUser({
      email: state.email,
      username: state.username,
      fname: state.fname,
      lname: state.lname,
      password: state.password,
    })
      .then((res) => {
        if (res) {
          alert("User registered successfully");
          useSetUserCache({
            email: state.email,
            username: state.username,
            fname: state.fname,
            lname: state.lname,
            isSignedIn: true,
            isVerified: false,
            isAdmin: false,
          });
          dispatch({ type: "RESET" });
          router.replace("/Screens/UI/Home");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error registering user");
      })
      .finally(() => {
        dispatch({ type: "SET_IS_LOADING", payload: false });
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView
          // style={styles.container}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              {
                width: width * 0.85,
                // height: height * 0.5,
              },
              styles.box,
            ]}
          >
            <Text style={[{ fontSize: width * 0.07 }, styles.header]}>
              Register new account
            </Text>
            <TextInput
              placeholder="Email"
              placeholderTextColor={"rgba(146, 191, 170, 0.91)"}
              style={[
                {
                  width: width * 0.85,
                  height: height * 0.08,
                  fontSize: width * 0.05,
                },
                styles.input,
              ]}
              value={state.email}
              onChangeText={(text) => {
                dispatch({ type: "SET_EMAIL", payload: text });
              }}
            />
            <TextInput
              placeholder="Username"
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
              onChangeText={(text) => {
                dispatch({ type: "SET_USERNAME", payload: text });
              }}
            />
            <TextInput
              placeholder="First name"
              placeholderTextColor={"rgba(146, 191, 170, 0.91)"}
              style={[
                {
                  width: width * 0.85,
                  height: height * 0.08,
                  fontSize: width * 0.05,
                },
                styles.input,
              ]}
              value={state.fname}
              onChangeText={(text) => {
                dispatch({ type: "SET_FNAME", payload: text });
              }}
            />
            <TextInput
              placeholder="Last name"
              placeholderTextColor={"rgba(146, 191, 170, 0.91)"}
              style={[
                {
                  width: width * 0.85,
                  height: height * 0.08,
                  fontSize: width * 0.05,
                },
                styles.input,
              ]}
              value={state.lname}
              onChangeText={(text) => {
                dispatch({ type: "SET_LNAME", payload: text });
              }}
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
              onChangeText={(text) => {
                dispatch({ type: "SET_PASSWORD", payload: text });
              }}
            />
            <TextInput
              placeholder="Confirm Password"
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
              value={state.confirmPassword}
              onChangeText={(text) => {
                dispatch({ type: "SET_CONFIRM_PASSWORD", payload: text });
              }}
            />
            <TouchableOpacity style={styles.btn} onPress={handleRegister}>
              {!state.isLoading ? (
                <Text style={[{ fontSize: width * 0.06 }, styles.btnTxt]}>
                  Register
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
              Already have an account?{" "}
              <Link
                href={"/"}
                style={{
                  color: "rgba(227, 142, 14, 0.93)",
                  fontWeight: "bold",
                }}
              >
                Login
              </Link>
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: "center",
    // alignItems: "center",
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
