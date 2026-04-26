import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { Tabs, useRouter, useFocusEffect } from "expo-router";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { ScrollView, StyleSheet, View, ActivityIndicator } from "react-native";
import { useAuth } from "@/context/auth";
import { UserContext } from "@/context/UserContext";

import {
  GreetingSection,
  HeaderButtons,
  MemoryCategories,
  QuickActions,
  RecentActivity,
  StatsSection
} from '@/components/index';
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
  });
  const router = useRouter();
  const { fetchWithAuth } = useAuth();
  const [statsData, setStatsData] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const url = `${process.env.EXPO_PUBLIC_API_BASE}/stats/home`;
      const res = await fetchWithAuth(url);
      const json = await res.json();
      if (json.status === "success") {
        setStatsData(json.data);
      }
    } catch (err) {
      console.warn("Failed to fetch stats:", err);
    } finally {
      setLoadingStats(false);
    }
  }, [fetchWithAuth]);

  const { user, statsUpdated, setStatsUpdated } = useContext(UserContext) ?? {};

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useFocusEffect(
    useCallback(() => {
      if (statsUpdated) {
        fetchStats();
        setStatsUpdated?.(false);
      }
    }, [statsUpdated, fetchStats, setStatsUpdated])
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Tabs.Screen
        options={{
          headerShown: false,
        }}
      />
      
      {}
      <View style={styles.customHeader}>
        <HeaderButtons router={router} type="left" />
        <HeaderButtons router={router} type="right" />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
        >
        <GreetingSection />
        <QuickActions router={router} />
        
        {loadingStats ? (
          <ActivityIndicator size="large" color="gray" style={{ marginVertical: 30 }} />
        ) : (
          <>
            <StatsSection 
              totalMemories={statsData?.totalMemories}
              favoritesCount={statsData?.favoritesCount}
              thisWeekStreak={statsData?.thisWeekStreak}
            />
            <MemoryCategories categories={statsData?.categories} />
            <RecentActivity activityData={statsData?.recentActivity} />
          </>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  customHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "black",
  },
  scrollContainer: {
    paddingBottom: 70,
    paddingTop: 10,
  },
  bottomSpacer: {
    height: 50,
  },
});