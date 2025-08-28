import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeSceen() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <>
              <Pressable style={styles.headerIcon} onPress={()=>router.push("/(dashboard)/Notification/page")} >
                <Ionicons name="notifications-outline" color={"white"} size={20} />
              </Pressable>
            </>),
        }} />
      <View style={styles.container} >
        <Text>hello</Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  headerIcon : {
    marginRight:15,
    borderRadius:50,
    backgroundColor : "#1E1F22",
    padding : 5
  }

})