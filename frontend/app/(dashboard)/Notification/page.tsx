import { Inter_500Medium } from "@expo-google-fonts/inter"
import { Ionicons } from "@expo/vector-icons"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

export default function NotificationScreen() {
    const [fontsLoaded] = useFonts({
        Inter_500Medium,
    })
    return (
        <View style={styles.container} >
            <Stack.Screen options={{
                headerShown: true,
                animation: "slide_from_right",
                headerStyle: {
                    backgroundColor: "black",
                },
                headerTitleStyle: {
                    color: "white",
                    fontFamily: "Inter_500Medium",
                    fontSize: 19,
                    fontWeight: "500",
                },
                headerTintColor: "white",
                title: "Notification",
            }} />
            <View style={styles.emptyBox} >
                <View style={styles.emptyContent}>
                    <Ionicons  name="notifications-outline" color="#9A9B9E" size={30} />
                    <Text style={styles.emptyText}>No notifications</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black"
    },
    text: {
        color: "white"
    },
    emptyBox: {
        // backgroundColor: "#101012",
        marginHorizontal: 20,
        marginVertical: 40,
        borderRadius: 15,
        height: 80,
        justifyContent: "center",
        alignItems: "center",
        flex : 1
    },
    emptyContent: {
        alignItems: "center",
        gap: 8
    },
    emptyText: {
        color: "#9A9B9E",
        fontFamily: "Inter_500Medium",
        fontSize: 16
    }
})