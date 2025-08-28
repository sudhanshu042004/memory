import { Stack } from "expo-router"
import { Text, View } from "react-native"

export default function NotificationScreen(){
    return (
        <>
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
        <View>
            <Text>hello</Text>
        </View>
        </>
    )
}