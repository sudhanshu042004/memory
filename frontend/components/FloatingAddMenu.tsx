import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const icons = [
  { name: "link-outline", route: "/(dashboard)/form/AddLink/page", label: "Link" },
  { name: "create-outline", route: "/(dashboard)/form/AddText/page", label: "Text" },
  { name: "document-outline", route: "/(dashboard)/form/AddPdf/page", label: "PDF" },
  { name: "image-outline", route: "/(dashboard)/form/AddImages/page", label: "Image" },
] as const;

const radius = 110;

interface FloatingAddMenuProps {
  router: any;
}

export default function FloatingAddMenu({ router }: FloatingAddMenuProps) {
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

  const handleIconPress = (route: any) => {
    setExpanded(false);
    progress.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.exp),
    });
    rotation.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
    router.push(route);
  };

  return (
    <View style={styles.menuContainer}>
      {icons.map((icon, index) => {
        const angle = (-90 + index * (360 / icons.length)) * (Math.PI / 180);

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
          <Animated.View
            key={index}
            style={[styles.smallCreateBox, animatedStyle]}
          >
            <Pressable
              onPress={() => handleIconPress(icon.route)}
              style={styles.iconPressable}
            >
              <Ionicons name={icon.name} color="white" size={22} />
            </Pressable>
            {expanded && (
              <Text style={styles.floatingLabel}>{icon.label}</Text>
            )}
          </Animated.View>
        );
      })}

      <View style={styles.labelBox}>
        <Text style={styles.label}>Add Memory</Text>
      </View>
      <Pressable onPress={toggleMenu} style={styles.centerIcon}>
        <Animated.View style={centerIconStyle}>
          <Ionicons name="add-outline" color={"white"} size={32} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },
  centerIcon: {
    borderRadius: 100,
    backgroundColor: "#4A90E2",
    padding: 18,
    zIndex: 3,
    elevation: 8,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  smallCreateBox: {
    position: "absolute",
    borderRadius: 100,
    backgroundColor: "#1E1F22",
    padding: 12,
    zIndex: 2,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconPressable: {
    padding: 4,
  },
  labelBox: {
    marginBottom: 15,
  },
  label: {
    color: "white",
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  floatingLabel: {
    position: "absolute",
    top: -25,
    color: "white",
    fontSize: 11,
    textAlign: "center",
    minWidth: 50,
  },
});
