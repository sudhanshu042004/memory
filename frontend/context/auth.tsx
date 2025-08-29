import { BASE_URL, GOOGLE_CLIENT_ID } from "@/constant";
import { AuthError, AuthRequestConfig, makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";

WebBrowser.maybeCompleteAuthSession();

export type AuthUser = {
    id : string,
    email : string,
    name : string,
    picture? : string,
    given_name? : string,
    family_name? : string,
    email_verified? : string,
    provider? : string,
    exp? : number,
    cookieExpiration? : number, 
}

const AuthContext  = React.createContext({
    user : null as AuthUser | null,
    signIn : ()=>{},
    signOut : ()=>{},
    fetchWithAuth : async(url : string,options? : RequestInit) => Promise.resolve(new Response()),
    isLoading : false,
    error : null as AuthError | null,
});

const config:AuthRequestConfig = {
    clientId : GOOGLE_CLIENT_ID!,
    scopes : ["openid","profile","email"],
    redirectUri:makeRedirectUri({
        scheme : "ai-memory",
        // useProxy : true
        
    } as any),
    responseType : "code",
}

// If using Google
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke'
};

export const AuthProvider = ({children}:{children : React.ReactNode})=>{
    const [user,setUser] = React.useState<AuthUser | null>(null);
    const [isLoading,setIsLoading] = React.useState(false);
    const [error,setError] = React.useState<AuthError | null>(null);
    const [request, response, promptAsync] = useAuthRequest(config,discovery);

    React.useEffect(()=>{
        handleResponse();
    },[response])

    const handleResponse = async()=>{
        console.log("handling response");
        if(response?.type === "success"){
            setIsLoading(true);
            try{
                console.log("Auth successful");
                const {code} = response.params;
                console.log(code)

                // const tokenResponse = await fetch(`${BASE_URL}/api/auth/token`,{
                //     method : 'POST',
                //     headers : {
                //         'Content-Type' : 'application/json',
                //     },
                //     body : JSON.stringify({code}),
                // });

                // const tokenData = await tokenResponse.json();
                // if(tokenResponse.ok && tokenData.user){
                //     setUser(tokenData.user);
                // } else {
                //     throw new Error(tokenData.error || "Failed to sign in");
                // }

            } catch (e){
                console.error('Token exchange error',e);
                setError(new AuthError({error : 'token_exchange_error',error_description : 'Failed to exchange code for token'}));
            }finally{
                setIsLoading(false);
            }
        }else if(response?.type==="error"){
            console.error("Auth error:",response.error);
            setError(response.error as AuthError);
        } else if (response?.type === "dismiss"){
            console.log("user dissmiss");
        }
    }

    const signIn = async () => {
        try {
            setIsLoading(true);
            if (!request) {
                console.log("No request object available");
                return;
            }
            
            await promptAsync();
        } catch (e) {
            console.error('Sign in error:', e);
            setError(new AuthError({ error: 'sign_in_error', error_description: 'Failed to initiate sign in' }));
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async() =>{
        try {
            setIsLoading(true);
            //api call for invalidate token
        } catch (error) {
            console.error('Signout Error',error);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchWithAuth = async(url:string,options:RequestInit={})=>{
        const authOptions = {
            ...options,
            credentials : 'include' as RequestCredentials
        }
        
        try {
            const response = await fetch(url, authOptions);
            
            // If unauthorized and we have a user, try to refresh the token
            if (response.status === 401 && user) {
                const refreshResponse = await fetch(`${BASE_URL}/api/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include',
                });
                
                if (refreshResponse.ok) {
                    // Token refreshed, retry the original request
                    return fetch(url, authOptions);
                } else {
                    // Failed to refresh token, sign out
                    await signOut();
                }
            }
            
            return response;
        } catch (e) {
            console.error('Fetch error:', e);
            throw e;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            signIn,
            signOut,
            fetchWithAuth,
            isLoading,
            error
        }} >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>{
    const context = React.useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be within an AuthProvider");
    }
    return context;
}