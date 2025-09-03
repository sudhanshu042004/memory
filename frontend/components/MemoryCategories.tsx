import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const categoriesData = [
  { icon: "image-outline", color: "#4A90E2", title: "Photos", count: "642" },
  { icon: "document-text-outline", color: "#50C878", title: "Notes", count: "298" },
  { icon: "link-outline", color: "#FF6B6B", title: "Links", count: "187" },
  { icon: "document-outline", color: "#FFB347", title: "PDFs", count: "120" },
];

export default function MemoryCategories() {
  return (
    <View style={styles.categoriesSection}>
      <Text style={styles.sectionTitle}>Memory Categories</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {categoriesData.map((category, index) => (
          <View key={index} style={styles.categoryCard}>
            <Ionicons name={category.icon as any} color={category.color} size={28} />
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryCount}>{category.count}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    marginBottom: 15,
    fontWeight: "600",
    paddingHorizontal: 20,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    backgroundColor: "#1E1F22",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginRight: 15,
    width: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryTitle: {
    color: "white",
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    marginTop: 8,
    marginBottom: 4,
  },
  categoryCount: {
    color: "#888",
    fontSize: 12,
  },
});
