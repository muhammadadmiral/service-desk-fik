// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Daftar path yang cuma boleh diakses oleh masing-masing role
const roleBasedRoutes: Record<string, string[]> = {
  "/mahasiswa": ["mahasiswa"],
  "/dosen": ["dosen"],
  "/admin": ["admin"],
  "/executive": ["executive"],
};

// Path publik yang nggak perlu login
const publicPaths = [
  "/login",
  "/api/auth",    // NextAuth routes
  "/_next",       // asset internal Next.js
  "/static",      // static files
  "/favicon.ico",
];

export async function middleware(request: NextRequest) {``
  const { pathname } = request.nextUrl;

  // Lewatkan request ke path publik
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Ambil token JWT
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Kalau belum login → redirect ke login + bawa callbackUrl
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Cek akses role-based
  for (const [basePath, allowedRoles] of Object.entries(roleBasedRoutes)) {
    if (pathname.startsWith(basePath) && !allowedRoles.includes(token.role as string)) {
      // Kalau token.role bukan jatah, redirect ke dashboard role dia sendiri
      const userRole = token.role as string;
      const dashUrl = new URL(`/${userRole}/dashboard`, request.url);
      return NextResponse.redirect(dashUrl);
    }
  }

  // Semua OK, lanjutkan request
  return NextResponse.next();
}

export const config = {
  // Hanya jalankan middleware di route berikut:
  matcher: [
    "/mahasiswa/:path*",
    "/dosen/:path*",
    "/admin/:path*",
    "/executive/:path*",
  ],
};
