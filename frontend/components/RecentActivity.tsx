import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Activity {
  id: string;
  title: string;
  type: string;
  createdAt: string;
}

interface RecentActivityProps {
  activityData?: Activity[];
}

export default function RecentActivity({ activityData = [] }: RecentActivityProps) {
  const mapIcon = (type: string) => {
    switch(type) {
      case 'image': return { icon: "image-outline", color: "#4A90E2" };
      case 'link': return { icon: "link-outline", color: "#50C878" };
      case 'text': return { icon: "document-text-outline", color: "#FF6B6B" };
      case 'pdf': return { icon: "document-outline", color: "#FFB347" };
      default: return { icon: "document-outline", color: "#FFF" };
    }
  };

  const getRelativeTime = (dateStr: string) => {
    const time = new Date(dateStr).getTime();
    const diff = Date.now() - time;
    if (diff < 3600000) return `${Math.max(1, Math.floor(diff / 60000))} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return `${Math.floor(diff / 86400000)} days ago`;
  };

  const formattedData = activityData.map(item => ({
    ...item,
    ...mapIcon(item.type),
    time: getRelativeTime(item.createdAt)
  }));

  return (
    <View style={styles.recentBox}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      
      {formattedData.length === 0 ? (
        <Text style={styles.emptyText}>No recent activity yet.</Text>
      ) : (
        formattedData.map((activity, index) => (
          <View key={index} style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Ionicons name={activity.icon as any} color={activity.color} size={20} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))
      )}
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
  emptyText: {
    color: "#888",
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  }
});
