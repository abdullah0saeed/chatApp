import { useReducer, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Image,
  ScrollView,
} from "react-native";
import { Link, router } from "expo-router";
import { loginUser } from "@/app/requests/userRequests";
import useSetUserCache from "@/hooks/user/useSetUserCache";
import AuthProvider from "./providers/AuthProvider";
import AuthInputField from "./components/AuthInputField";
import AuthButton from "./components/AuthButton";

// Reducer initial state
const initialState = { username: "", password: "" };

// Reducer
const reducer = (state: any, action: { type: string; payload: any }) => {
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, username: action.payload.trim() };
    case "SET_PASSWORD":
      return { ...state, password: action.payload.trim() };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export default function Login() {
  const { width, height } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleLogin = async () => {
    if (!state.username || !state.password) {
      return alert("Please fill in all fields");
    }

    setIsLoading(true);
    try {
      const res = await loginUser({
        username: state.username,
        password: state.password,
      });

      if (res) {
        useSetUserCache({
          id: res.id,
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthProvider>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.centeredContainer}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.flexGrow}>
            <View style={styles.container}>
              <Image
                source={require("../assets/images/myLogo.png")}
                style={{
                  width: width * 0.35,
                  height: width * 0.35,
                  marginBottom: width * 0.05,
                }}
              />

              <View
                style={[
                  { width: width * 0.85, height: height * 0.5 },
                  styles.box,
                ]}
              >
                <Text style={[{ fontSize: width * 0.07 }, styles.header]}>
                  Login to your account
                </Text>

                <AuthInputField
                  placeHolder="Username | Email"
                  value={state.username}
                  onChangeText={(text) =>
                    dispatch({ type: "SET_USERNAME", payload: text })
                  }
                />

                <AuthInputField
                  placeHolder="Password"
                  value={state.password}
                  onChangeText={(text) =>
                    dispatch({ type: "SET_PASSWORD", payload: text })
                  }
                  otherProps={{ secureTextEntry: true }}
                />

                <AuthButton
                  text="Login"
                  isLoading={isLoading}
                  onPress={handleLogin}
                />

                <Text
                  style={[
                    { fontSize: width * 0.05, marginTop: height * 0.02 },
                    styles.registerTxt,
                  ]}
                >
                  Don't have an account?{" "}
                  <Link href="/Screens/Signup" style={styles.link}>
                    Register
                  </Link>
                </Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </AuthProvider>
  );
}

// Styles
const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flexGrow: {
    flexGrow: 1,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "rgba(19, 135, 63, 0.82)",
  },
  registerTxt: {
    textAlign: "center",
    color: "rgba(7, 71, 53, 0.82)",
  },
  link: {
    color: "rgba(227, 142, 14, 0.93)",
    fontWeight: "bold",
  },
});
