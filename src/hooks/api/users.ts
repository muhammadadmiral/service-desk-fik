// src/hooks/api/users.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Get all users with optional filtering
export function useUsers(params?: any) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => apiClient.users.getAll(params).then(res => res.data),
  });
}

// Get available dosen for assigning tickets
export function useAvailableDosen(department?: string) {
  return useQuery({
    queryKey: ["available-dosen", department],
    queryFn: () => apiClient.users.getAvailableDosen(department).then(res => res.data),
  });
}

// Get user profile
export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => apiClient.auth.getProfile().then(res => res.data),
  });
}

// Create user (admin only)
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: any) => 
      apiClient.users.adminCreate(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "User created",
        description: "The user has been created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create user",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

// Update user (admin only)
export function useUpdateUser(id: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: any) => 
      apiClient.users.adminUpdate(id, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      toast({
        title: "User updated",
        description: "The user has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update user",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

// Get user performance metrics
export function useUserPerformance(userId: number, params?: any) {
  return useQuery({
    queryKey: ["user-performance", userId, params],
    queryFn: () => apiClient.executive.getUserPerformance(userId, params).then(res => res.data),
    enabled: !!userId,
  });
}

// Get user workload
export function useUserWorkload(userId: number) {
  return useQuery({
    queryKey: ["user-workload", userId],
    queryFn: () => apiClient.tickets.getWorkload(userId).then(res => res.data),
    enabled: !!userId,
  });
}