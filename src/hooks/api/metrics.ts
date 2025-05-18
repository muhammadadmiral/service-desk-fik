// src/hooks/api/metrics.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

// Get executive dashboard metrics
export function useExecutiveDashboard(params?: any) {
  return useQuery({
    queryKey: ["executive-dashboard", params],
    queryFn: () => apiClient.executive.getDashboard(params).then(res => res.data),
  });
}

// Get users with performance metrics
export function useUsersPerformance(params?: any) {
  return useQuery({
    queryKey: ["users-performance", params],
    queryFn: () => apiClient.users.getPerformance(params).then(res => res.data),
  });
}

// Get ticket categories for reporting
export function useTicketCategories() {
  return useQuery({
    queryKey: ["ticket-categories"],
    queryFn: () => apiClient.settings.getTicketCategories().then(res => res.data),
  });
}