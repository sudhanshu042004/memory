import { UserContext } from "@/context/UserContext";
import { Inter_600SemiBold, useFonts } from "@expo-google-fonts/inter";
import { useContext } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";


const SettingScreen = ()=>{
    const [fontsLoaded] = useFonts({
        Inter_600SemiBold
    })
    const user = useContext(UserContext);
    return (
        <SafeAreaView style={styles.container} >
            <View>
                <Text style={styles.textHeading} >Account</Text>
            </View>
        </SafeAreaView>
    )
}
export default SettingScreen;

const styles = StyleSheet.create({
    container : {
        backgroundColor : "black",
        flex:1,
    },
    textHeading :{
        color : "white",
        fontSize : 25,
        fontFamily : "Inter_600SemiBold",
        paddingLeft : 15
    } 
})