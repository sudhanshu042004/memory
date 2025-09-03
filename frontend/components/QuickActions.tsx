import React from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface QuickActionsProps {
  router: any;
}

const quickActionsData = [
  { icon: "document-text-outline", label: "Text", route: "/(dashboard)/form/AddText/page" },
  { icon: "image-outline", label: "Image", route: "/(dashboard)/form/AddImages/page" },
  { icon: "link-outline", label: "Link", route: "/(dashboard)/form/AddLink/page" },
  { icon: "document-outline", label: "PDF", route: "/(dashboard)/form/AddPdf/page" },
];

export default function QuickActions({ router }: QuickActionsProps) {
  const handleQuickAction = (route: string) => {
    router.push(route);
  };

  return (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        {quickActionsData.map((action, index) => (
          <Pressable 
            key={index}
            style={styles.actionBtn}
            onPress={() => handleQuickAction(action.route)}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name={action.icon as any} color="white" size={24} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    marginBottom: 15,
    fontWeight: "600",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionBtn: {
    alignItems: "center",
    backgroundColor: "#1E1F22",
    padding: 16,
    borderRadius: 16,
    width: (width - 60) / 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionIconContainer: {
    marginBottom: 8,
  },
  actionLabel: {
    color: "white",
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
});
