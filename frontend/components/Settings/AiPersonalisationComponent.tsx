import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';



export default function AiPersonalisationComponent() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("formal");
    const [items, setItems] = useState([
        { label: 'Friendly', value: 'friendly' },
        { label: 'Formal', value: 'formal' },
        { label: 'Neutral', value: 'neutral' }
    ]);
    const [fontsLoaded] = useFonts({
        Inter_600SemiBold,
        Inter_500Medium,
        Inter_400Regular,
        Inter_700Bold
    })

    return (
        <View>
            <Text style={styles.textHeading}>Ai & Personalisation</Text>
            <View style={styles.boxContainer}>
                <View style={styles.boxContainerTextBox} >
                    <Text style={styles.boxMainText} >AI personality settings</Text>
                    <Text style={styles.boxSecondaryText}>Set the tone of your AI's response to match your style</Text>
                </View>
                
                <View style={styles.dropdownWrapper}>
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        textStyle={styles.dropdownText}
                        listMode="SCROLLVIEW"
                        // arrowIconStyle={{tintColor : "white"}}
                        // tickIconStyle={{tintColor : "white"}}
                    />
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
        paddingLeft: 20,
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
        gap: 4,
        flexShrink: 2
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
    dropdownWrapper: {
        width: 130,
        justifyContent: 'center',
        zIndex:1000
    },

    dropdown: {
        backgroundColor: '#25272E',
        borderColor: '#444',
        borderRadius: 8,
        height: 40, 
        paddingHorizontal: 10,
    },

    dropdownContainer: {
        backgroundColor: '#17181B',
        borderColor: '#444',
        borderRadius: 8,
    },

    dropdownText: {
        color: 'white',
        fontSize: 14,
        fontFamily: "Inter_400Regular",
    },

})