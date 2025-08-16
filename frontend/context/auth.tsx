import { BASE_URL, GOOGLE_CLIENT_ID } from "@/constant";
import { AuthError } from "expo-auth-session";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from "expo-web-browser";
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
    signOut: () => { },
    fetchWithAuth: async (url: string, options?: RequestInit) => Promise.resolve(new Response()),
    isLoading: false,
    error: null as AuthError | null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = React.useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<AuthError | null>(null);

    // Use Expo's Google provider instead of manual configuration
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        scopes: ["openid", "profile", "email"],
        redirectUri: `https://auth.expo.io/@sudhanshu15/ai-memory`,
    });

    React.useEffect(() => {
        if (response) {
            handleResponse();
        }
    }, [response]);

    const handleResponse = async () => {
        console.log("=== Auth Response Debug ===");
        console.log("Response type:", response?.type);
        console.log("Response params:", response?.params);
        console.log("Response error:", response?.error);

        if (response?.type === "success") {
            setIsLoading(true);
            setError(null);

            try {
                console.log("Auth successful, processing token exchange...");
                
                // Get the access token directly from the response
                const { access_token, id_token } = response.params;
                
                if (!access_token) {
                    throw new Error("No access token received");
                }

                console.log("Access token received:", access_token ? "✓" : "✗");
                console.log("ID token received:", id_token ? "✓" : "✗");

                // Send the access token to your backend
                const tokenResponse = await fetch(`${BASE_URL}/api/auth/google/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        access_token,
                        id_token 
                    }),
                    credentials: 'include',
                });

                console.log("Token response status:", tokenResponse.status);
                console.log("Token response ok:", tokenResponse.ok);

                const tokenData = await tokenResponse.json();
                console.log("Token response data:", tokenData);

                if (tokenResponse.ok && tokenData.status === "success" && tokenData.user) {
                    setUser(tokenData.user);
                    console.log("User signed in successfully:", tokenData.user);
                } else {
                    console.log("Token exchange failed:", tokenData);
                    throw new Error(tokenData.message || "Failed to sign in");
                }

            } catch (e: any) {
                console.error('Token exchange error:', e);
                console.error('Error details:', e.message);
                setError(new AuthError({
                    error: 'token_exchange_error',
                    error_description: `Failed to exchange token: ${e.message}`
                }));
            } finally {
                setIsLoading(false);
            }
        } else if (response?.type === "error") {
            console.error("Auth error:", response.error);
            setError(response.error as AuthError);
            setIsLoading(false);
        } else if (response?.type === "dismiss") {
            console.log("User dismissed auth flow");
            setIsLoading(false);
        }
    };

    const signIn = async () => {
        try {
            setError(null);
            setIsLoading(true);

            if (!request) {
                console.log("Request not ready yet");
                setIsLoading(false);
                return;
            }

            console.log("Initiating Google sign in...");
            await promptAsync();
        } catch (e: any) {
            console.error('Sign in error:', e);
            setError(new AuthError({
                error: 'sign_in_error',
                error_description: 'Failed to initiate sign in'
            }));
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setIsLoading(true);

            // Call backend logout endpoint
            const response = await fetch(`${BASE_URL}/api/auth/google/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                console.warn('Logout request failed, but continuing with local logout');
            }

            setUser(null);
            setError(null);
        } catch (error) {
            console.error('Signout Error:', error);
            setUser(null);
            setError(null);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        const authOptions = {
            ...options,
            credentials: 'include' as RequestCredentials
        };

        try {
            const response = await fetch(url, authOptions);

            if (response.status === 401 && user) {
                console.log('Got 401, attempting token refresh...');
                
                const refreshResponse = await fetch(`${BASE_URL}/api/auth/google/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (refreshResponse.ok) {
                    console.log('Token refresh successful, retrying original request');
                    return fetch(url, authOptions);
                } else {
                    console.log('Token refresh failed, signing out user');
                    await signOut();
                    throw new Error('Session expired. Please sign in again.');
                }
            }

            return response;
        } catch (e) {
            console.error('Fetch error:', e);
            throw e;
        }
    };

    // Check if user is already authenticated on app start
    React.useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                setIsLoading(true);
                
                const response = await fetch(`${BASE_URL}/api/auth/me`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const userData = await response.json();
                    if (userData.status === "success" && userData.user) {
                        setUser(userData.user);
                        console.log('User already authenticated:', userData.user);
                    }
                }
            } catch (error) {
                console.log('No existing authentication found');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            signIn,
            signOut,
            fetchWithAuth,
            isLoading,
            error
        }}>
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
};