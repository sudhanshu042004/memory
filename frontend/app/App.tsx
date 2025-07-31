import { TextInput, View } from "react-native"
import "../global.css"
//
export default function App(){
    return(
        <View
        //  style={{flex : 1,justifyContent : "center", alignItems : "center"}}
         className="flex-1 justify-center items-center p-3" 
         >
        <TextInput className="border w-full rounded-lg" placeholder="name"/>
        </View>
    )
}

// const style = StyleSheet.create({

//     container : {
//         flex : 1,
//         justifyContent : "center",
//         alignItems : "center",
//     }
// })