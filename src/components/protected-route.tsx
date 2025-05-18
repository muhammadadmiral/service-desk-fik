// src/components/protected-route.tsx
"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type Props = {
  children: ReactNode;
  allowedRoles?: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check for token and user role in localStorage
    const token = localStorage.getItem("auth_token");
    const userJson = localStorage.getItem("auth_user");
    
    if (!token || !userJson) {
      // Redirect to login if not authenticated
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    try {
      const user = JSON.parse(userJson);
      
      // Check role-based access if allowedRoles is specified
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          toast({
            title: "Access denied",
            description: "You do not have permission to access this page",
            variant: "destructive",
          });
          
          // Redirect to appropriate dashboard
          router.push(`/${user.role}/dashboard`);
          return;
        }
      }
      
      // User is authenticated and has permission
      setIsAuthenticated(true);
    } catch (error) {
      // Invalid user JSON
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router, toast, allowedRoles]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Show children only if authenticated
  return isAuthenticated ? <>{children}</> : null;
}