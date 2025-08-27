import AccountComponent from "@/components/Settings/AccountComponent";
import AiPersonalisationComponent from "@/components/Settings/AiPersonalisationComponent";
import PrivacyComponent from "@/components/Settings/PrivacyComponent";
import { UserContext } from "@/context/UserContext";
import { useContext } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";



const SettingScreen = () => {
    const userContexr = useContext(UserContext);
    return (
        <ScrollView>
            <SafeAreaView style={styles.container} >
                <AccountComponent UserData={userContexr?.user} />
                <PrivacyComponent />
                {/* //ai and personalisation */}
                <AiPersonalisationComponent />
                {/* //security */}
                <View>
                    <Text style={styles.textHeading} >Security</Text>
                    <View style={styles.boxContainer} >

                    </View>
                </View>

                {/* //logout (different) */}
                <View>
                    {/* <Text style={styles.textHeading} >Privacy</Text> */}
                    <View style={styles.boxContainer} >

                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
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
        flexDirection: "row",
        justifyContent: "space-between"
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
        fontFamily: "Inter_400Regular"
    },
    ImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        // flexDirection : "row"
    },
    image: {
        width: '100%',
        height: '100%',
    },
})