import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MemoryCategoriesProps {
  categories?: {
    text: number;
    link: number;
    image: number;
    pdf: number;
  };
}

export default function MemoryCategories({ categories }: MemoryCategoriesProps) {
  const categoriesData = [
    { icon: "image-outline", color: "#4A90E2", title: "Photos", count: categories?.image?.toString() || "0" },
    { icon: "document-text-outline", color: "#50C878", title: "Notes", count: categories?.text?.toString() || "0" },
    { icon: "link-outline", color: "#FF6B6B", title: "Links", count: categories?.link?.toString() || "0" },
    { icon: "document-outline", color: "#FFB347", title: "PDFs", count: categories?.pdf?.toString() || "0" },
  ];
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
