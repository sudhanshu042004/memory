import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderButtonsProps {
  router: any;
  type: 'left' | 'right';
}

export default function HeaderButtons({ router, type }: HeaderButtonsProps) {
  const handlePress = () => {
    if (type === 'right') {
      router.push("/(dashboard)/Notification/page");
    } else {
      router.push("/(dashboard)/profile/page");
    }
  };

  const iconName = type === 'right' ? 'notifications-outline' : 'person-circle-outline';

  return (
    <Pressable style={styles.headerIcon} onPress={handlePress}>
      <Ionicons name={iconName} color={"white"} size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    marginHorizontal: 15,
    borderRadius: 50,
    backgroundColor: "#1E1F22",
    padding: 8,
  },
});
