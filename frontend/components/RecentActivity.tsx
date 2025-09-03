import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const activityData = [
  { icon: "image-outline", color: "#4A90E2", title: "Added vacation photo", time: "2 hours ago" },
  { icon: "link-outline", color: "#50C878", title: "Saved article link", time: "Yesterday at 3:45 PM" },
  { icon: "document-text-outline", color: "#FF6B6B", title: "Created meeting notes", time: "3 days ago" },
  { icon: "document-outline", color: "#FFB347", title: "Uploaded document", time: "1 week ago" },
];

export default function RecentActivity() {
  return (
    <View style={styles.recentBox}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {activityData.map((activity, index) => (
        <View key={index} style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Ionicons name={activity.icon as any} color={activity.color} size={20} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  recentBox: {
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
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1F22",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A2B2E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: "white",
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    marginBottom: 2,
  },
  activityTime: {
    color: "#888",
    fontSize: 13,
  },
});
