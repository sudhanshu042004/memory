import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await AsyncStorage.getItem("session");
      if (session) {
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  if (isLoading) return null;

  return (
    <>
      {isLoggedIn ? (
        <Redirect href="/Home/page" />
      ) : (
        <Redirect href="/(auth)/Signup/page" />
      )}
    </>
  );
}