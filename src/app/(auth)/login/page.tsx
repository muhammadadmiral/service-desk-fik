// src/app/(auth)/login/page.tsx
import Image from "next/image";
import { LoginForm } from "./login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Service Desk FIK",
  description: "Login to your Service Desk FIK account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <div className="hidden sm:flex sm:w-1/2 bg-primary items-center justify-center p-10">
        <div className="max-w-lg text-center">
          <Image 
            src="/logo-upnvj.png" 
            alt="UPN Veteran Jakarta" 
            width={150} 
            height={150} 
            className="mx-auto mb-8"
          />
          <h1 className="text-3xl font-bold text-white mb-6">
            Service Desk Fakultas Ilmu Komputer
          </h1>
          <p className="text-white/90 text-lg">
            Platform layanan terpadu untuk mahasiswa, dosen, dan staf FIK UPN Veteran Jakarta
          </p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-4 sm:p-10">
        <LoginForm />
      </div>
    </div>
  );
}