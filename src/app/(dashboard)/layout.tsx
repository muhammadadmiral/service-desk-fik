// src/app/(dashboard)/layout.tsx
import Link from "next/link";
import { SideNav } from "@/components/shared/side-nav";
import { TopNav } from "@/components/shared/top-nav";
import { AppErrorBoundary } from "@/components/shared/error-boundary";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 p-6">
          <AppErrorBoundary>
            {children}
          </AppErrorBoundary>
        </main>
      </div>
    </div>
  );
}