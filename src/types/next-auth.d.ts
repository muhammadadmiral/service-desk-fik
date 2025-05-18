// src/types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    name: string;
    email: string;
    nim?: string;
    role: string;
    department?: string;
    access_token: string;
  }

  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      nim?: string;
      role: string;
    };
    access_token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: string;
    nim?: string;
    access_token: string;
  }
}