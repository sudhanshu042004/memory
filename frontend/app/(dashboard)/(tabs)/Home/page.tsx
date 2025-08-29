import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const icons = [
  { name: "link-outline", route: "/link" },
  { name: "create-outline", route: "/create" },
  { name: "document-outline", route: "/document" },
  { name: "image-outline", route: "/image" },
] as const;

const radius = 100;

export default function HomeScreen() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const progress = useSharedValue(0);
  const rotation = useSharedValue(0); 

  const toggleMenu = () => {
    const newState = !expanded;
    setExpanded(newState);

    progress.value = withTiming(newState ? 1 : 0, {
      duration: 400,
      easing: Easing.out(Easing.exp),
    });

    rotation.value = withTiming(newState ? 45 : 0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  };

  const centerIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              style={styles.headerIcon}
              onPress={() => router.push("/(dashboard)/Notification/page")}
            >
              <Ionicons name="notifications-outline" color={"white"} size={20} />
            </Pressable>
          ),
        }}
      />

      <View style={styles.container}>
        <Pressable onPress={toggleMenu} style={styles.centerIcon}>
          <Animated.View style={centerIconStyle}>
            <Ionicons
              name="add-outline"
              color={"white"}
              size={30}
            />
          </Animated.View>
        </Pressable>

        {/* Animated Icons */}
        {icons.map((icon, index) => {
          const angle = (index * (360 / icons.length)) * (Math.PI / 180);

          const animatedStyle = useAnimatedStyle(() => {
            const x = radius * Math.cos(angle) * progress.value;
            const y = radius * Math.sin(angle) * progress.value;

            return {
              transform: [
                { translateX: x },
                { translateY: y },
                { scale: progress.value },
              ],
              opacity: progress.value,
            };
          });

          return (
            <Animated.View key={index} style={[styles.createBox, animatedStyle]}>
              <Pressable>
                <Ionicons name={icon.name} color="white" size={20} />
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  headerIcon: {
    marginRight: 15,
    borderRadius: 50,
    backgroundColor: "#1E1F22",
    padding: 5,
  },
  centerIcon: {
    borderRadius: 100,
    backgroundColor: "#1E1F22",
    padding: 20,
    zIndex: 2,
  },
  createBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -30,
    marginTop: -30,
    borderRadius: 100,
    backgroundColor: "#1E1F22",
    padding: 20,
    zIndex: 1,
  },
});
