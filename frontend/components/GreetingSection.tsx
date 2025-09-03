import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { UserContext } from "@/context/UserContext";
export default function GreetingSection() {
     const userContext = useContext(UserContext);
     const name = userContext?.user?.name;

  return (
    <View style={styles.headerBox}>
      <Text style={styles.welcomeText}>Hello, {name}</Text>
      <Text style={styles.subText}>Track and add your memories easily</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBox: {
    marginTop: 10,
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  welcomeText: {
    color: "white",
    fontSize: 24,
    fontFamily: "Inter_500Medium",
    fontWeight: "600",
  },
  subText: {
    color: "#888",
    fontSize: 15,
    marginTop: 6,
    lineHeight: 20,
  },
});
