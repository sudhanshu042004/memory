import { AUTH_URL } from "@/constant";
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
      const res = await fetch(`${AUTH_URL}/user`, {
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${token}`,
        },
      });
      if (!res.ok) throw new Error("Unauthorized");
      
      const resData: User = await res.json();
      setUser(resData);
    } catch (err) {
      console.log("Error fetching user:", err);
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
