import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const icons = [
  { name: "link-outline", route: "/(dashboard)/AddLink/page" },
  { name: "create-outline", route: "/(dashboard)/AddText/page" },
  { name: "document-outline", route: "/(dashboard)/AddPdf/page" },
  { name: "image-outline", route: "/(dashboard)/AddImages/page" },
] as const;

const radius = 100;

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
          Inter_500Medium,
      }) 
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

  const handleIconPress = (route : any) => {
    // Close menu and navigate
    setExpanded(false);
    progress.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.exp),
    });
    rotation.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
    router.push(route)
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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

      <View style={styles.statsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Added</Text>
          <Text style={styles.cardValue}>120</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Added</Text>
          <Text style={styles.cardValue}>15</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>

        {icons.map((icon, index) => {
          const angle = (-90 + (index * (360 / icons.length))) * (Math.PI / 180);

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
            <Animated.View key={index} style={[styles.smallCreateBox, animatedStyle]}>
              <Pressable
                onPress={() => handleIconPress(icon.route)}
                style={styles.iconPressable}
              >
                <Ionicons name={icon.name} color="white" size={20} />
              </Pressable>
            </Animated.View>
          );
        })}

        <View style={styles.labelBox} >
          <Text style={styles.label} >
            Add memory
          </Text>
        </View>
        <Pressable onPress={toggleMenu} style={styles.centerIcon}>
          <Animated.View style={centerIconStyle}>
            <Ionicons name="add-outline" color={"white"} size={30} />
          </Animated.View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black",
    gap: 100
  },
  headerIcon: {
    marginRight: 15,
    borderRadius: 50,
    backgroundColor: "#1E1F22",
    padding: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "#1E1F22",
    borderRadius: 12,
    paddingVertical: 20,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 8,
    fontFamily : "Inter_700Bold"
  },
  cardValue: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  menuContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 50,
    position: "relative",
  },
  centerIcon: {
    borderRadius: 100,
    backgroundColor: "#1E1F22",
    padding: 15,
    zIndex: 3,
    elevation: 3,
  },
  smallCreateBox: {
    position: "absolute",
    borderRadius: 100,
    backgroundColor: "#1E1F22",
    padding: 15,
    zIndex: 2,
    elevation: 2,
  },
  iconPressable: {
    padding: 5,
  },
  labelBox:{
   marginBottom : 10,
  },
  label : {
    color : "white",
    fontFamily : "Inter_500Medium"
  }
});