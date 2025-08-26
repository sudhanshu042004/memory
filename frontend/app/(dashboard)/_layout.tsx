import { UserProvider } from "@/context/UserContext";
import { Stack } from "expo-router";

export default function dashboardLayout(){
    return(
        <>
        <UserProvider>
            <Stack screenOptions={{headerShown : false}} />
        </UserProvider>
        </>
    )
}