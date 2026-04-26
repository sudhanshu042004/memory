import { User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useCallback, useEffect, useState } from "react";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | null>(null);


function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = atob(base64);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("session");
      if (!token) {
        setUser(null);
        return;
      }

      const payload = decodeJwtPayload(token);
      if (!payload) {
        setUser(null);
        return;
      }

      
      if (payload.exp && Date.now() / 1000 > payload.exp) {
        await AsyncStorage.removeItem("session");
        setUser(null);
        return;
      }

      setUser({
        id: payload.userId,
        name: payload.name ?? "",
        email: payload.email ?? "",
        avatar: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.log("Error loading user from token:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("session");
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, isLoading, refreshUser: fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
