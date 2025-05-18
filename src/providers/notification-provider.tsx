// src/providers/notification-provider.tsx
"use client";

import { useContext, createContext, useState, useEffect, ReactNode } from "react";
import { useNotifications } from "@/hooks/api/notification";


type NotificationContextType = {
  unreadCount: number;
  refreshNotifications: () => void;
};

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  refreshNotifications: () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { data: notifications, refetch } = useNotifications();
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Update unread count when notifications change
  useEffect(() => {
    if (notifications) {
      setUnreadCount(notifications.filter(n => !n.isRead).length);
    }
  }, [notifications]);
  
  // Set up interval to refresh notifications
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [refetch]);
  
  const refreshNotifications = () => {
    refetch();
  };
  
  return (
    <NotificationContext.Provider value={{ unreadCount, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotificationContext = () => useContext(NotificationContext);