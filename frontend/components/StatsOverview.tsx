import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const statsData = [
  [
    { icon: "library-outline", color: "#4A90E2", title: "Total Memories", value: "1,247", subtext: "+12 this week" },
    { icon: "trending-up-outline", color: "#50C878", title: "This Week", value: "23", subtext: "+8 from last week" },
  ],
  [
    { icon: "flame-outline", color: "#FF6B6B", title: "Streak", value: "7 days", subtext: "Keep it up!" },
    { icon: "heart-outline", color: "#FF69B4", title: "Favorites", value: "89", subtext: "Most loved" },
  ],
];

export default function StatsOverview() {
  return (
    <View style={styles.statsSection}>
      <Text style={styles.sectionTitle}>Your Stats</Text>
      {statsData.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.statsContainer}>
          {row.map((stat, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name={stat.icon as any} color={stat.color} size={20} />
                <Text style={styles.cardTitle}>{stat.title}</Text>
              </View>
              <Text style={styles.cardValue}>{stat.value}</Text>
              <Text style={styles.cardSubtext}>{stat.subtext}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  statsSection: {
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    flex: 1,
    backgroundColor: "#1E1F22",
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    color: "#aaa",
    fontSize: 13,
    marginLeft: 8,
    fontFamily: "Inter_500Medium",
  },
  cardValue: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtext: {
    color: "#666",
    fontSize: 12,
  },
});