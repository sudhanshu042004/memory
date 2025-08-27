import { UserContext } from "@/context/UserContext";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { Image } from "expo-image";
import { useContext } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

const blurhash ='|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const defaultProfilePic = "https://picsum.photos/seed/696/3000/2000"

const SettingScreen = () => {
    const [fontsLoaded] = useFonts({
        Inter_600SemiBold,
        Inter_500Medium,
        Inter_400Regular,
        Inter_700Bold
    })
    const userContexr = useContext(UserContext);
    return (
        <SafeAreaView style={styles.container} >
            // account cards
            <View>
                <Text style={styles.textHeading} >Account</Text>
                <View style={styles.boxContainer} >
                    <View style={styles.boxContainerTextBox} >
                        <Text style={styles.boxMainText} >
                            {userContexr?.user?.name}
                        </Text>
                        <Text style={styles.boxSecondaryText} >
                            {userContexr?.user?.email}
                        </Text>
                        {/* <Text style={styles.boxThirdText}>Tap to edit the profile</Text> */}
                    </View>
                    <View style={styles.ImageContainer} >
                        <Image
                            style={styles.image}
                            source={userContexr?.user?.avatar || defaultProfilePic}
                            placeholder={{ blurhash }}
                            contentFit="cover"
                            transition={1000}
                        />
                    </View>
                </View>
            </View>
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
        paddingLeft: 15
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
        flexDirection : "row",
        justifyContent : "space-between"
    },
    boxContainerTextBox : {
        gap : 4
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