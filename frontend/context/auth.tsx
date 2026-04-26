import { BASE_URL, GOOGLE_CLIENT_ID } from "@/constant";
import { AuthError, AuthRequestConfig, makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";

WebBrowser.maybeCompleteAuthSession();

export type AuthUser = {
    id: string,
    email: string,
    name: string,
    picture?: string,
    given_name?: string,
    family_name?: string,
    email_verified?: string,
    provider?: string,
    exp?: number,
    cookieExpiration?: number,
}

const AuthContext = React.createContext({
    user: null as AuthUser | null,
    signIn: () => { },
    signOut: async () => { },
    fetchWithAuth: async (url: string, options?: RequestInit) => Promise.resolve(new Response()),
    isLoading: false,
    error: null as AuthError | null,
});

const config: AuthRequestConfig = {
    clientId: GOOGLE_CLIENT_ID!,
    scopes: ["openid", "profile", "email"],
    redirectUri: makeRedirectUri({
        scheme: "ai-memory",
        

    } as any),
    responseType: "code",
}


const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke'
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = React.useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<AuthError | null>(null);
    const [request, response, promptAsync] = useAuthRequest(config, discovery);

    
    React.useEffect(() => {
        const loadStoredUser = async () => {
            try {
                const token = await AsyncStorage.getItem('session');
                if (token) {
                    
                    const parts = token.split('.');
                    if (parts.length === 3) {
                        const payload = JSON.parse(atob(parts[1]));
                        setUser({
                            id: payload.userId,
                            email: payload.email,
                            name: payload.name,
                            exp: payload.exp,
                        });
                    }
                }
            } catch (e) {
                console.error('Failed to load stored session:', e);
            }
        };
        loadStoredUser();
    }, []);

    React.useEffect(() => {
        handleResponse();
    }, [response])

    const handleResponse = async () => {
        console.log("handling response");
        if (response?.type === "success") {
            setIsLoading(true);
            try {
                console.log("Auth successful");
                const { code } = response.params;
                console.log(code)

                
                
                
                
                
                
                

                
                
                
                
                
                

            } catch (e) {
                console.error('Token exchange error', e);
                setError(new AuthError({ error: 'token_exchange_error', error_description: 'Failed to exchange code for token' }));
            } finally {
                setIsLoading(false);
            }
        } else if (response?.type === "error") {
            console.error("Auth error:", response.error);
            setError(response.error as AuthError);
        } else if (response?.type === "dismiss") {
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

    const signOut = async () => {
        try {
            setIsLoading(true);
            await AsyncStorage.removeItem('session');
            setUser(null);
        } catch (error) {
            console.error('Signout Error', error);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        try {
            
            const token = await AsyncStorage.getItem('session');

            
            const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

            const defaultHeaders: Record<string, string> = {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };
            if (!isFormData) {
                defaultHeaders['Content-Type'] = 'application/json';
            }

            const authOptions: RequestInit = {
                ...options,
                headers: {
                    ...defaultHeaders,
                    ...(options.headers as Record<string, string> || {}),
                },
            };

            const response = await fetch(url, authOptions);

            
            if (response.status === 401) {
                await signOut();
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

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be within an AuthProvider");
    }
    return context;
}