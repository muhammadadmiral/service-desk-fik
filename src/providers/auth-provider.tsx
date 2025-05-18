// src/providers/auth-provider.tsx
"use client";

import { SessionProvider, signOut } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  
  // Handle 401 errors globally
  useEffect(() => {
    const handleUnauthorized = (event: CustomEvent) => {
      // Only redirect to login if we're not already on an auth page
      if (!pathname.startsWith('/login') && !pathname.startsWith('/register')) {
        toast({
          title: "Session expired",
          description: "Please log in again to continue",
          variant: "destructive",
        });
        
        // Use Next.js router for client-side navigation
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      }
    };

    // Listen for custom unauthorized event
    window.addEventListener('unauthorized' as any, handleUnauthorized);
    
    return () => {
      window.removeEventListener('unauthorized' as any, handleUnauthorized);
    };
  }, [pathname, router, toast]);

  return <SessionProvider>{children}</SessionProvider>;
}