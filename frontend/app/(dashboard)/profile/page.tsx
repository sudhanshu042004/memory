import { Inter_400Regular, Inter_500Medium, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import { Text, View } from "react-native";


const profilePage = () => {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
        Inter_500Medium,
      });
    return (
        <>
            <View>
                <Stack.Screen options={{
                    headerShown: true, headerStyle: {
                        backgroundColor: "black",
                    },
                    headerTitleStyle: {
                        color: "white",
                        fontFamily: "Inter_500Medium",
                        fontSize: 19,
                        fontWeight: "500",
                    },
                    headerTintColor : "white",
                    title: "Profile",
                    animation: "slide_from_right"
                }} />
                <Text>This is Profile page</Text>
            </View>
        </>
    )
}

export default profilePage