import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function AuthLayout() {
    return (
        <View style={styles.container} >
            <Stack>
                <Stack.Screen name="Signin/page" options={{ title: "signin", animation: "slide_from_left" }} />
                <Stack.Screen name="Signup/page" options={{ title: "signup", animation: "slide_from_bottom" }} />
            </Stack>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        backgroundColor: "black"
    }
})