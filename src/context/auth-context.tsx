"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios, { AxiosInstance } from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL ||
  "https://service-desk-fik-backend-production.up.railway.app";

// User type
export interface User {
  id: number;
  name: string;
  email: string;
  nim?: string;
  role: string;
  department?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (creds: { email?: string; nim?: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const api: AxiosInstance = axios.create({ baseURL: API_URL });

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

      api
        .get<User>("/auth/profile")
        .then((res) => setUser(res.data))
        .catch(() => {
          // Token invalid or expired
          logout();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  // Global 401 interceptor
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
          toast({
            title: "Session expired",
            description: "Please log in again to continue",
            variant: "destructive",
          });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [token]);

  // Perform login (email or NIM)
  const login = async (
    creds: { email?: string; nim?: string; password: string }
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const endpoint = creds.email ? "/auth/login" : "/auth/login/nim";
      const payload = creds.email
        ? { email: creds.email, password: creds.password }
        : { nim: creds.nim, password: creds.password };

      const { data } = await api.post<{
        access_token: string;
        user: User;
      }>(endpoint, payload);

      // Save state & storage
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.access_token}`;

      return true;
    } catch (err: any) {
      toast({
        title: "Login failed",
        description:
          err.response?.data?.message || err.message || "Authentication failed",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    delete api.defaults.headers.common["Authorization"];
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
