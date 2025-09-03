import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function AuthLayout() {
    return (
        <View style={styles.container} >
            <Stack>

                <Stack.Screen name="Signin/page" options={{
                    title: "Signin", animation: "slide_from_left",
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: "black",

                    },
                    headerTitleStyle: {
                        color: "white"
                    }
                }} />
                <Stack.Screen name="Signup/page" options={{
                    title: "signup", animation: "slide_from_left",
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: "black",

                    },
                    headerTitleStyle: {
                        color: "white"
                    }
                }} />

                <Stack.Screen
                    name="ForgotPassword/page"
                    options={{
                        title: "Forgot Password",
                        animation: "slide_from_right",
                        headerStyle: { backgroundColor: "#121212" },
                        headerTitleStyle: { color: "white" },
                        headerTintColor: "white", 
                    }}
                />
            </Stack>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black"
    }
})