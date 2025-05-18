// src/lib/auth.ts
import axios from "axios";
import { API_BASE_URL } from "./api";

// Type definitions
export type User = {
  id: number;
  name: string;
  email: string;
  nim?: string;
  role: string;
  department?: string;
};

export type LoginResponse = {
  access_token: string;
  user: User;
};

// Login with email
export async function loginWithEmail(email: string, password: string): Promise<LoginResponse> {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
}

// Login with NIM
export async function loginWithNIM(nim: string, password: string): Promise<LoginResponse> {
  const response = await axios.post(`${API_BASE_URL}/auth/login/nim`, {
    nim,
    password,
  });
  return response.data;
}

// Get current user profile
export async function getProfile(): Promise<User> {
  const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;
  
  if (!token) {
    throw new Error("Not authenticated");
  }
  
  const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
}

// Get user role from localStorage
export function getUserRole(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const userJson = localStorage.getItem("auth_user");
  if (!userJson) {
    return null;
  }
  
  try {
    const user = JSON.parse(userJson);
    return user.role;
  } catch {
    return null;
  }
}