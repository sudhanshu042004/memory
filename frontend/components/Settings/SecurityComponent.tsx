import { useState } from "react";
import { StyleSheet, Switch, Text, View } from 'react-native';


export default function SecurityComponent() {
    const [AppLock, setAppLock] = useState(false);
    const [twoFA,setTwoFA] = useState(false);
    return (
        <View>
            <Text style={styles.textHeading}>Security</Text>
            <View style={styles.boxContainer}>
                <View style={styles.boxContainerRow} >
                    <View style={styles.boxContainerTextBox} >
                        <Text style={styles.boxMainText}>App lock</Text>
                        <Text style={styles.boxSecondaryText} >Protect your app with a PIN or biometrics</Text>
                    </View>
                    <View style={styles.deleteTextBox} >
                        <Switch
                            value={AppLock}
                            onValueChange={AppLock => {
                                setAppLock(AppLock)
                            }}
                            thumbColor={"white"}
                            trackColor={{ false: "#868789", true: "#6D78E7" }}

                        />
                    </View>
                </View>
                <View style={styles.hr} />
                <View style={styles.boxContainerRow}>
                    <View style={styles.boxContainerTextBox}>
                        <Text style={styles.boxMainText} >2FA</Text>
                        <Text style={styles.boxSecondaryText} >Enable 2FA for stronger protection</Text>
                    </View>
                    <View style={styles.deleteTextBox}>
                        <Switch
                            value={twoFA}
                            onValueChange={twoFA => {
                                setTwoFA(twoFA)
                            }}
                            thumbColor={"white"}
                            trackColor={{ false: "#868789", true: "#6D78E7" }}

                        />
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