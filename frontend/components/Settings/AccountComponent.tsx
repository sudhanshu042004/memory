import { User } from "@/types";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";


const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const defaultProfilePic = "https://picsum.photos/seed/696/3000/2000"

export default function AccountComponent({ UserData }: { UserData: User | null | undefined }) {
    const [fontsLoaded] = useFonts({
        Inter_600SemiBold,
        Inter_500Medium,
        Inter_400Regular,
        Inter_700Bold
    })
    const router = useRouter();
    const date = new Date(UserData?.createdAt as string);
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
    return (
        <View>
            <Text style={styles.textHeading} >Account</Text>
            <Pressable onPress={() => router.push("/(dashboard)/profile/page")} >
                <View style={styles.boxContainer}>
                    <View style={styles.boxContainerTextBox} >
                        <Text style={styles.boxMainText} >
                            {UserData?.name}
                        </Text>
                        <Text style={styles.boxSecondaryText} >
                            {UserData?.email}
                        </Text>
                        
                        <Text style={styles.boxSecondaryText}>{formattedDate}</Text>
                    </View>
                    <View style={styles.ImageContainer} >
                        <Image
                            style={styles.image}
                            source={UserData?.avatar || defaultProfilePic}
                            placeholder={{ blurhash }}
                            contentFit="cover"
                            transition={1000}
                        />
                    </View>
                </View>
            </Pressable>
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
        flexDirection: "row",
        justifyContent: "space-between"
    },
    boxContainerTextBox: {
        gap:4
    },
    boxMainText: {
        color: "white",
        fontFamily: "Inter_500Medium",
    },
    boxSecondaryText: {
        color: '#9A9B9E',
        fontFamily: "Inter_400Regular",
        fontSize:12
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
})
