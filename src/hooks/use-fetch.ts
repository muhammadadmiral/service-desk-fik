// src/hooks/use-fetch.ts
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useFetch() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchData = async <T>(
    promise: Promise<T>,
    options?: {
      successMessage?: string;
      errorMessage?: string;
      showSuccessToast?: boolean;
      showErrorToast?: boolean;
    }
  ): Promise<T | null> => {
    const {
      successMessage = "Operation successful",
      errorMessage = "An error occurred",
      showSuccessToast = false,
      showErrorToast = true,
    } = options || {};

    setIsLoading(true);

    try {
      const response = await promise;
      
      if (showSuccessToast) {
        toast({
          title: "Success",
          description: successMessage,
          variant: "success",
        });
      }
      
      return response;
    } catch (error: any) {
      console.error("API Error:", error);
      
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401) {
        // Dispatch a custom event for the auth provider to handle
        window.dispatchEvent(
          new CustomEvent('unauthorized', { detail: { error } })
        );
      } 
      // Handle other errors with toast if specified
      else if (showErrorToast) {
        toast({
          title: "Error",
          description: error.response?.data?.message || errorMessage,
          variant: "destructive",
        });
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchData, isLoading };
}