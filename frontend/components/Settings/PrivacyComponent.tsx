import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { StyleSheet, Text, View } from "react-native";

export default function PrivacyComponent() {
    const [fontsLoaded] = useFonts({
        Inter_600SemiBold,
        Inter_500Medium,
        Inter_400Regular,
        Inter_700Bold
    })
    return (
        <View>
            <Text style={styles.textHeading} >Privacy</Text>
            <View style={styles.boxContainer}>
                    <View style={styles.boxContainerRow} >
                        <View style={styles.boxContainerTextBox} >
                            <Text style={styles.boxMainText} >Delete Account & Data</Text>
                            <Text style={styles.boxSecondaryText}>Once deleted, your account and data cannot be recovered.</Text>
                        </View>
                        <View style={styles.deleteTextBox} >
                            <Text style={styles.deleteText}>Delete...</Text>
                        </View>
                    </View>
               
                <View style={styles.hr} />
                <View>
                    <View style={styles.boxContainerTextBox}>
                        <Text style={styles.boxMainText} >Clear AI Memory</Text>
                        <Text style={styles.boxSecondaryText}>Reset conversation & stored data</Text>
                    </View>
                </View>
                <View style={styles.hr} />
                <View>
                    <View style={styles.boxContainerTextBox}>
                        <Text style={styles.boxMainText} >Manage AI Memory Retention</Text>
                        <Text style={styles.boxSecondaryText}>Choose how long AI remembers data</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}
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
        gap: 4,
        flexShrink: 2,
        marginRight: 25
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
    deleteTextBox: {
        justifyContent: "center",
        alignItems: "center",
        marginRight: 4

    },
    deleteText: {
        color: "#F4817E"
    },
    hr: {
        borderBottomWidth: 1.5,
        marginVertical: 10,
        borderBottomColor: "#25272E",
        marginTop: 15,
        marginBottom: 10,
    }
})