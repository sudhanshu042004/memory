import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";

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
        <Redirect href="/(dashboard)/(tabs)/Home/page" />
      ) : (
        <Redirect href="/(auth)/Signup/page" />
      )}
    </>
  );
}