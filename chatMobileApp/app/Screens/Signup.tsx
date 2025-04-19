// import {
//   View,
//   Text,
//   StyleSheet,
//   useWindowDimensions,
//   TextInput,
//   ActivityIndicator,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   TouchableWithoutFeedback,
//   Keyboard,
//   ScrollView,
//   Platform,
//   Pressable,
//   Touchable,
// } from "react-native";
// import React from "react";
// import { Link, router } from "expo-router";
// import { signupUser } from "@/app/requests/userRequests";
// import useSetUserCache from "@/hooks/user/useSetUserCache";

// export default function Signup() {
//   const { width, height } = useWindowDimensions();

//   const reducer = (state: any, action: { type: string; payload: any }) => {
//     switch (action.type) {
//       case "SET_EMAIL":
//         return { ...state, email: action.payload.trim() };
//       case "SET_USERNAME":
//         return { ...state, username: action.payload.trim() };
//       case "SET_FNAME":
//         return { ...state, fname: action.payload.trim() };
//       case "SET_LNAME":
//         return { ...state, lname: action.payload.trim() };
//       case "SET_PASSWORD":
//         return { ...state, password: action.payload.trim() };
//       case "SET_CONFIRM_PASSWORD":
//         return { ...state, confirmPassword: action.payload.trim() };
//       case "RESET":
//         return {
//           ...state,
//           email: "",
//           username: "",
//           fname: "",
//           lname: "",
//           password: "",
//           confirmPassword: "",
//         };
//       case "SET_IS_LOADING":
//         return { ...state, isLoading: action.payload };
//       default:
//         return state;
//     }
//   };
//   const initialState = {
//     email: "",
//     username: "",
//     fname: "",
//     lname: "",
//     password: "",
//     confirmPassword: "",
//     isLoading: false,
//   };
//   const [state, dispatch] = React.useReducer(reducer, initialState);
//   const handleRegister = () => {
//     dispatch({ type: "SET_IS_LOADING", payload: true });
//     if (
//       !state.username ||
//       !state.password ||
//       !state.confirmPassword ||
//       !state.email ||
//       !state.fname ||
//       !state.lname
//     ) {
//       dispatch({ type: "SET_IS_LOADING", payload: false });
//       return alert("Please fill in all fields");
//     }
//     if (state.password !== state.confirmPassword) {
//       dispatch({ type: "SET_IS_LOADING", payload: false });
//       return alert("Passwords do not match");
//     }
//     if (state.password.length < 6) {
//       dispatch({ type: "SET_IS_LOADING", payload: false });
//       return alert("Password must be at least 6 characters long");
//     }

//     signupUser({
//       email: state.email,
//       username: state.username,
//       fname: state.fname,
//       lname: state.lname,
//       password: state.password,
//     })
//       .then((res) => {
//         if (res) {
//           useSetUserCache({
//             id: res.id,
//             email: state.email,
//             username: state.username,
//             fname: state.fname,
//             lname: state.lname,
//             isSignedIn: true,
//             isVerified: false,
//             isAdmin: false,
//           });
//           dispatch({ type: "RESET" });
//           router.replace("/Screens/UI");
//         }
//       })
//       .catch((err) => {
//         console.error(err);
//         alert("Error registering user");
//       })
//       .finally(() => {
//         dispatch({ type: "SET_IS_LOADING", payload: false });
//       });
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={{ flex: 1 }}
//       keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
//     >
//       <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
//         <ScrollView
//           // style={styles.container}
//           contentContainerStyle={{
//             justifyContent: "center",
//             alignItems: "center",
//             flexGrow: 1,
//           }}
//           showsVerticalScrollIndicator={false}
//           showsHorizontalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           <View
//             style={[
//               {
//                 width: width * 0.85,
//                 // height: height * 0.5,
//               },
//               styles.box,
//             ]}
//           >
//             <Text style={[{ fontSize: width * 0.07 }, styles.header]}>
//               Register new account
//             </Text>
//             <TextInput
//               placeholder="Email"
//               placeholderTextColor={"rgba(146, 191, 170, 0.91)"}
//               autoCapitalize="none"
//               style={[
//                 {
//                   width: width * 0.85,
//                   height: height * 0.08,
//                   fontSize: width * 0.05,
//                 },
//                 styles.input,
//               ]}
//               value={state.email}
//               onChangeText={(text) => {
//                 dispatch({ type: "SET_EMAIL", payload: text });
//               }}
//             />
//             <TextInput
//               placeholder="Username"
//               placeholderTextColor={"rgba(146, 191, 170, 0.91)"}
//               autoCapitalize="none"
//               style={[
//                 {
//                   width: width * 0.85,
//                   height: height * 0.08,
//                   fontSize: width * 0.05,
//                 },
//                 styles.input,
//               ]}
//               value={state.username}
//               onChangeText={(text) => {
//                 dispatch({ type: "SET_USERNAME", payload: text });
//               }}
//             />
//             <TextInput
//               placeholder="First name"
//               placeholderTextColor={"rgba(146, 191, 170, 0.91)"}
//               autoCapitalize="none"
//               style={[
//                 {
//                   width: width * 0.85,
//                   height: height * 0.08,
//                   fontSize: width * 0.05,
//                 },
//                 styles.input,
//               ]}
//               value={state.fname}
//               onChangeText={(text) => {
//                 dispatch({ type: "SET_FNAME", payload: text });
//               }}
//             />
//             <TextInput
//               placeholder="Last name"
//               placeholderTextColor={"rgba(146, 191, 170, 0.91)"}
//               autoCapitalize="none"
//               style={[
//                 {
//                   width: width * 0.85,
//                   height: height * 0.08,
//                   fontSize: width * 0.05,
//                 },
//                 styles.input,
//               ]}
//               value={state.lname}
//               onChangeText={(text) => {
//                 dispatch({ type: "SET_LNAME", payload: text });
//               }}
//             />
//             <TextInput
//               placeholder="Password"
//               placeholderTextColor={"rgba(146, 191, 170, 0.91)"}
//               autoCapitalize="none"
//               secureTextEntry={true}
//               style={[
//                 {
//                   width: width * 0.85,
//                   height: height * 0.08,
//                   fontSize: width * 0.05,
//                 },
//                 styles.input,
//               ]}
//               value={state.password}
//               onChangeText={(text) => {
//                 dispatch({ type: "SET_PASSWORD", payload: text });
//               }}
//             />
//             <TextInput
//               placeholder="Confirm Password"
//               placeholderTextColor={"rgba(146, 191, 170, 0.91)"}
//               autoCapitalize="none"
//               secureTextEntry={true}
//               style={[
//                 {
//                   width: width * 0.85,
//                   height: height * 0.08,
//                   fontSize: width * 0.05,
//                 },
//                 styles.input,
//               ]}
//               value={state.confirmPassword}
//               onChangeText={(text) => {
//                 dispatch({ type: "SET_CONFIRM_PASSWORD", payload: text });
//               }}
//             />
//             <TouchableOpacity
//               style={[
//                 styles.btn,
//                 state.isLoading && {
//                   backgroundColor: "rgba(167, 210, 184, 0.82)",
//                 },
//               ]}
//               onPress={handleRegister}
//               disabled={state.isLoading}
//             >
//               {!state.isLoading ? (
//                 <Text style={[{ fontSize: width * 0.06 }, styles.btnTxt]}>
//                   Register
//                 </Text>
//               ) : (
//                 <ActivityIndicator
//                   size="large"
//                   color="white"
//                   style={{ width: "100%", height: "100%" }}
//                 />
//               )}
//             </TouchableOpacity>
//             <Text
//               style={[
//                 { fontSize: width * 0.05, marginTop: height * 0.02 },
//                 styles.registerTxt,
//               ]}
//             >
//               Already have an account?{" "}
//               <Link
//                 href={"/"}
//                 style={{
//                   color: "rgba(227, 142, 14, 0.93)",
//                   fontWeight: "bold",
//                 }}
//               >
//                 Login
//               </Link>
//             </Text>
//           </View>
//         </ScrollView>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     // justifyContent: "center",
//     // alignItems: "center",
//     flex: 1,
//   },
//   box: { justifyContent: "center", alignItems: "center" },
//   input: {
//     borderWidth: 1,
//     borderColor: "black",
//     marginBottom: 20,
//     borderRadius: 15,
//     padding: 10,
//     textAlign: "center",
//     textAlignVertical: "center",
//     backgroundColor: "white",
//     color: "rgba(39, 96, 69, 0.91)",
//     fontWeight: "bold",
//   },
//   btn: {
//     backgroundColor: "rgba(13, 176, 75, 0.82)",
//     borderRadius: 15,
//     padding: 10,
//     textAlign: "center",
//     textAlignVertical: "center",
//     marginTop: 20,
//     borderColor: "#fff",
//     width: "90%",
//     maxHeight: 50,
//   },
//   btnTxt: {
//     textAlign: "center",
//     textAlignVertical: "center",
//     color: "white",
//     fontWeight: "bold",
//   },
//   header: {
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//     textAlignVertical: "center",
//     color: "rgba(19, 135, 63, 0.82)",
//   },
//   registerTxt: {
//     textAlign: "center",
//     textAlignVertical: "center",
//     color: "rgba(7, 71, 53, 0.82)",
//   },
// });

import React, { useReducer } from "react";
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
} from "react-native";
import { Link, router } from "expo-router";
import { signupUser } from "@/app/requests/userRequests";
import useSetUserCache from "@/hooks/user/useSetUserCache";
import AuthInputField from "@/app/components/AuthInputField";
import AuthButton from "@/app/components/AuthButton";

// types and constants
const ACTIONS = {
  SET_FIELD: "SET_FIELD",
  RESET: "RESET",
  SET_LOADING: "SET_LOADING",
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

// reducer
function reducer(state: typeof initialState, action: any) {
  switch (action.type) {
    case ACTIONS.SET_FIELD:
      return { ...state, [action.field]: action.payload.trim() };
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
}

export default function Signup() {
  const { width, height } = useWindowDimensions();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (field: string) => (text: string) =>
    dispatch({ type: ACTIONS.SET_FIELD, field, payload: text });

  const handleRegister = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    const { email, username, fname, lname, password, confirmPassword } = state;

    if (
      !email ||
      !username ||
      !fname ||
      !lname ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill in all fields");
      return dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }

    try {
      const res = await signupUser({ email, username, fname, lname, password });
      if (res) {
        useSetUserCache({
          id: res.id,
          email,
          username,
          fname,
          lname,
          isSignedIn: true,
          isVerified: false,
          isAdmin: false,
        });
        dispatch({ type: ACTIONS.RESET });
        router.replace("/Screens/UI");
      }
    } catch (err) {
      console.error(err);
      alert("Error registering user");
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.flex}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.box, { width: width * 0.85 }]}>
            <Text style={[styles.header, { fontSize: width * 0.07 }]}>
              Register new account
            </Text>

            <AuthInputField
              placeHolder="Email"
              value={state.email}
              onChangeText={handleChange("email")}
            />

            <AuthInputField
              placeHolder="Username"
              value={state.username}
              onChangeText={handleChange("username")}
            />

            <AuthInputField
              placeHolder="First name"
              value={state.fname}
              onChangeText={handleChange("fname")}
            />

            <AuthInputField
              placeHolder="Last name"
              value={state.lname}
              onChangeText={handleChange("lname")}
            />

            <AuthInputField
              placeHolder="Password"
              value={state.password}
              onChangeText={handleChange("password")}
              otherProps={{ secureTextEntry: true }}
            />

            <AuthInputField
              placeHolder="Confirm Password"
              value={state.confirmPassword}
              onChangeText={handleChange("confirmPassword")}
              otherProps={{ secureTextEntry: true }}
            />

            <AuthButton
              text="Register"
              isLoading={state.isLoading}
              onPress={handleRegister}
            />

            <Text
              style={[
                styles.registerTxt,
                { fontSize: width * 0.05, marginTop: height * 0.02 },
              ]}
            >
              Already have an account?{" "}
              <Link href={"/"} style={styles.loginLink}>
                Login
              </Link>
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// styles
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
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
  loginLink: {
    color: "rgba(227, 142, 14, 0.93)",
    fontWeight: "bold",
  },
});
