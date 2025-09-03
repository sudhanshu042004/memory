import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: "slide_from_right",
        headerStyle: { backgroundColor: "black" },
        headerTitleStyle: {
          color: "white",
          fontFamily: "Inter_500Medium",
          fontSize: 19,
          fontWeight: "500",
        },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="AddLink/page"
        options={{ title: "Add URL Memory" }}
      />
      <Stack.Screen
        name="AddImages/page"
        options={{ title: "Add Image Memory" }}
      />
      <Stack.Screen
        name="AddPdf/page"
        options={{ title: "Add PDF Memory" }}
      />
      <Stack.Screen
        name="AddText/page"
        options={{ title: "Add Text Memory" }}
      />
    </Stack>
  );
}
