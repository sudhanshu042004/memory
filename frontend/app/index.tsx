import { Redirect } from "expo-router";

export default function Index(){
    return(
        <>
        <Redirect href="/(auth)/Signup/page"/>
        {/* //<Redirect href="/Home/page"/> */}
        </>
    )
}