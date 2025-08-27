import AccountComponent from "@/components/Settings/AccountComponent";
import AiPersonalisationComponent from "@/components/Settings/AiPersonalisationComponent";
import PrivacyComponent from "@/components/Settings/PrivacyComponent";
import SecurityComponent from "@/components/Settings/SecurityComponent";
import { UserContext } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";



const SettingScreen = () => {
    const userContexr = useContext(UserContext);
    const router = useRouter();
    async function handleLogOut() {
        await AsyncStorage.multiRemove(['session']);
        router.replace("/(auth)/Signin/page");
    }
    return (
        <SafeAreaView style={styles.container} >
            <ScrollView>
                <AccountComponent UserData={userContexr?.user} />
                <PrivacyComponent /> 
                <AiPersonalisationComponent />
                <SecurityComponent />

                {/* logOut */}
                <Pressable onPress={()=>handleLogOut()} >
                    <View style={styles.boxContainer} >
                        <View style={styles.boxContainerRow}>
                            <View style={styles.boxContainerTextBox}>
                                <Text style={styles.boxMainText} >logout</Text>
                                <Text style={styles.boxSecondaryText} >Securely sign out from your account</Text>
                            </View>
                            <View style={styles.deleteTextBox}>
                                <Ionicons name="log-out-outline" color={"#F4817E"} size={22} />
                            </View>
                        </View>
                    </View>
                </Pressable>
                <View style={{ marginTop: 200 }} ></View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default SettingScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        flex: 1,
    },
    textHeading: {
        color: "white",
        fontSize: 25,
        fontFamily: "Inter_600SemiBold",
        paddingLeft: 20
    },
    boxContainer: {
        backgroundColor: "#17181B",
        marginHorizontal: 20,
        marginVertical: 20,
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 5,
        borderColor: "#25272E",
        borderWidth: 1,

    },
    boxContainerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    boxContainerTextBox: {
        gap: 4
    },
    boxMainText: {
        color: "white",
        fontFamily: "Inter_500Medium",
    },
    boxSecondaryText: {
        color: '#9A9B9E',
        fontFamily: "Inter_400Regular",
        textAlign: 'left',
        fontSize: 12,
        flexShrink: 1,
        flexWrap: "wrap"
    },
    ImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    deleteTextBox: {
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },
})