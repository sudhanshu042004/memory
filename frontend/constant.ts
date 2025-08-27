export const COOKIE_NAME = "auth_token"
export const COOKIE_MAX_AGE = 20;

export const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"; 

export const AUTH_URL = process.env.EXPO_PUBLIC_API_BASE;

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite : "Lax",
    path : "/",
    maxAge : COOKIE_MAX_AGE
}
