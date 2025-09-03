import React from "react";
import { SafeAreaView, StyleSheet, ScrollView, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";

import {
  HeaderButtons,
  GreetingSection,
  QuickActions,
  StatsSection,
  MemoryCategories,
  RecentActivity,
  FloatingAddMenu
} from '@/components/index';

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
  });
  const router = useRouter();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: {
            backgroundColor: "black",
          },
          headerRight: () => <HeaderButtons router={router} type="right" />,
          headerLeft: () => <HeaderButtons router={router} type="left" />,
        }}
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <GreetingSection />
        <QuickActions router={router} />
        <StatsSection />
        <MemoryCategories />
        <RecentActivity />
        
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* <FloatingAddMenu router={router} /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContainer: {
    paddingBottom: 70,
    paddingTop: 10,
  },
  bottomSpacer: {
    height: 50,
  },
});