import {View,Text,StyleSheet} from "react-native"

const HomePage=()=>{
    return(
        <View style={style.conatiner}>
            <Text style={style.text}>This is Home Page</Text>
        </View>
    )
}

const style = StyleSheet.create({
    conatiner:{
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:'black'
    },
    text:{
        fontSize:30,
        color:'white'
    }
})

export default HomePage;