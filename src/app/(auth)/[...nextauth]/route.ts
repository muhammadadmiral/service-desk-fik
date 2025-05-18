// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const authOptions: NextAuthOptions = {
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",  
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        nim: { label: "NIM", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const payload = credentials.email
            ? { email: credentials.email, password: credentials.password }
            : credentials.nim
            ? { nim: credentials.nim, password: credentials.password }
            : null;
          if (!payload) return null;

          const url =
            "email" in payload
              ? `${API_BASE_URL}/auth/login`
              : `${API_BASE_URL}/auth/login/nim`;

          const res = await axios.post(url, payload);
          const data = res.data;

          if (data?.access_token) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              nim: data.user.nim,
              role: data.user.role,
              department: data.user.department,
              access_token: data.access_token,
            };
          }
          return null;
        } catch (e: any) {
          console.error("authorize error:", e.response?.data || e.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // merge in on first sign-in
        token = { ...token, ...user } as any;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as number,
        name: token.name as string,
        email: token.email as string,
        nim: token.nim as string,
        role: token.role as string,
        department: token.department as string,
      };
      session.access_token = token.access_token as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
