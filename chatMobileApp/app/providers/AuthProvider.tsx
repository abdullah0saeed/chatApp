import { useEffect, useState } from "react";
import { router } from "expo-router";

import useGetUserCache from "@/hooks/user/useGetUserCache";
import useRemoveUserCache from "@/hooks/user/useRemoveUserCache";
import { I18nManager } from "react-native";

export default function AuthProvider({ children }: any) {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null); // null for loading state

  const checkIsAuth = async () => {
    const user = await useGetUserCache();
    if (!user) return setIsSignedIn(false);
    setIsSignedIn(user.isSignedIn);
  };

  useEffect(() => {
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
    I18nManager.swapLeftAndRightInRTL(false);
    checkIsAuth();
  }, []);

  useEffect(() => {
    if (isSignedIn === true) {
      router.replace("/Screens/UI");
    }
  }, [isSignedIn]);

  if (isSignedIn === null) return null;

  return isSignedIn === false ? children : null;
}
