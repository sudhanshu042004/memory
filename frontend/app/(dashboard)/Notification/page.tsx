import { Inter_500Medium } from "@expo-google-fonts/inter"
import { Ionicons } from "@expo/vector-icons"
import { useFonts } from "expo-font"
import { Stack, useRouter } from "expo-router"
import { StyleSheet, Text, View, Pressable } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function NotificationScreen() {
    const [fontsLoaded] = useFonts({
        Inter_500Medium,
    })
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container} >
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.customHeader}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>
                <Text style={styles.customHeaderTitle}>Notification</Text>
                <View style={{ width: 24, marginHorizontal: 15 }} />
            </View>
            <View style={styles.emptyBox} >
                <View style={styles.emptyContent}>
                    <Ionicons  name="notifications-outline" color="#9A9B9E" size={30} />
                    <Text style={styles.emptyText}>No notifications</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black"
    },
    customHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        backgroundColor: "black",
    },
    backButton: {
        marginHorizontal: 15,
        padding: 8,
        borderRadius: 50,
        backgroundColor: "#1E1F22",
    },
    customHeaderTitle: {
        color: "white",
        fontSize: 19,
        fontFamily: "Inter_500Medium",
    },
    text: {
        color: "white"
    },
    emptyBox: {
        
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