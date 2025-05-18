// src/hooks/api/notifications.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

// Get all notifications with optional unread filter
export function useNotifications(unread?: boolean) {
  return useQuery({
    queryKey: ["notifications", { unread }],
    queryFn: () => apiClient.notifications.getAll(unread).then(res => res.data),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

// Mark a notification as read
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiClient.notifications.markAsRead(id).then(res => res.data),
    onSuccess: () => {
      // Invalidate notifications queries to refetch with updated read status
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// Mark all notifications as read
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiClient.notifications.markAllAsRead().then(res => res.data),
    onSuccess: () => {
      // Invalidate notifications queries to refetch with updated read status
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// Delete a notification
export function useDeleteNotification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiClient.notifications.delete(id).then(res => res.data),
    onSuccess: () => {
      // Invalidate notifications queries to refetch with updated list
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}