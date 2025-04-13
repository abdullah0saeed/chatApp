import { useEffect, useState } from "react";
import { router } from "expo-router";

import useGetUserCache from "@/hooks/user/useGetUserCache";
import useRemoveUserCache from "@/hooks/user/useRemoveUserCache";

export default function AuthProvider({ children }: any) {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null); // null for loading state

  const checkIsAuth = async () => {
    const user = await useGetUserCache();
    if (!user) return setIsSignedIn(false);
    setIsSignedIn(user.isSignedIn);
  };

  useEffect(() => {
    checkIsAuth();
  }, []);

  useEffect(() => {
    if (isSignedIn === true) {
      router.replace("/Screens/UI");
    }
  }, [isSignedIn]);

  // Optionally show loading indicator while checking
  if (isSignedIn === null) return null;

  return isSignedIn === false ? children : null;
}
