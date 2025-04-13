import { Stack } from "expo-router";

export default () => {
  return (
    <Stack>
      <Stack.Screen name="Home" options={{ headerShown: false }} />
      <Stack.Screen name="Chat" options={{ headerShown: false }} />
    </Stack>
  );
};
