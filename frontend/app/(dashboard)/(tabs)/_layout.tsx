import { Inter_400Regular, Inter_500Medium, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Inter_500Medium,
  });

  if (!fontsLoaded) {
    return null; // Or return null
  }
  return (
      <View style={styles.container}>
        <Tabs
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "black",
              borderBottomColor: "transparent",
              borderBottomWidth: 1,
            },
            headerTitleStyle: {
              color: "white",
              fontFamily: "Inter_500Medium",
              fontSize: 19,
              fontWeight: "500",
            },
            tabBarStyle: {
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
              height: 70,
              borderRadius: 20,
              borderTopWidth: 0,
              marginHorizontal: 20,
              backgroundColor: "#151617",
            },
            tabBarShowLabel: true,
            tabBarItemStyle: {
              paddingTop: 10,
            },
            tabBarLabelStyle: {
              fontFamily: "Inter_500Medium"
            },
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "#81868f",
            // tabBarActiveBackgroundColor: "#1e2025"
          }}
        >
          <Tabs.Screen
            name="Home/page"
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => (
                <Feather name="home" color={color} size={24} />
              ),
            }}
          />
          <Tabs.Screen
            name="ask/page"
            options={{
              title: "Ask",
              tabBarIcon: ({ color }) => (
                <Ionicons name="chatbox-outline" color={color} size={24} />
              ),
            }}
          />
          <Tabs.Screen
            name="Settings/page"
            options={{
              title: "Settings",
              tabBarIcon: ({ color }) => (
                <Feather name="settings" color={color} size={24} />
              ),
            }}
          />
        </Tabs>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
