// src/components/notifications/notification-list.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow, format } from "date-fns";
import { 
  useNotifications, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead,
  useDeleteNotification 
} from "@/hooks/api/notification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CheckIcon, Trash2Icon, MailOpenIcon } from "lucide-react";

export function NotificationList() {
  const [filters, setFilters] = useState({
    type: "",
    search: "",
    unread: false,
  });
  
  const { data: notifications, isLoading, isError } = useNotifications(filters.unread);
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();
  
  // Handle mark notification as read
  const handleMarkAsRead = (id: number) => {
    markAsRead(id);
  };
  
  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };
  
  // Handle delete notification
  const handleDelete = (id: number) => {
    deleteNotification(id);
  };
  
  // Filter notifications
  const filteredNotifications = notifications?.filter(notification => {
    // Filter by type
    if (filters.type && notification.type !== filters.type) {
      return false;
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        notification.title.toLowerCase().includes(searchTerm) ||
        notification.message.toLowerCase().includes(searchTerm)
      );
    }
    
    return true;
  });
  
  // Type filter options
  const typeOptions = [
    { label: "All Types", value: "" },
    { label: "Ticket Assigned", value: "ticket_assigned" },
    { label: "Ticket Disposisi", value: "ticket_disposisi" },
    { label: "Ticket Status Changed", value: "ticket_status_changed" },
    { label: "Ticket Completed", value: "ticket_completed" },
    { label: "New Message", value: "ticket_message_added" },
    { label: "SLA Breach", value: "sla_breach" },
  ];
  
  // Read status options
  const readOptions = [
    { label: "All Notifications", value: "all" },
    { label: "Unread Only", value: "unread" },
  ];
  
  // Get notification icon and color based on type
  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "ticket_assigned":
        return { icon: "🎫", bgColor: "bg-primary/10", textColor: "text-primary" };
      case "ticket_disposisi":
        return { icon: "↪️", bgColor: "bg-warning/10", textColor: "text-warning" };
      case "ticket_status_changed":
        return { icon: "🔄", bgColor: "bg-info/10", textColor: "text-info" };
      case "ticket_completed":
        return { icon: "✅", bgColor: "bg-success/10", textColor: "text-success" };
      case "ticket_message_added":
        return { icon: "💬", bgColor: "bg-secondary/10", textColor: "text-secondary" };
      case "sla_breach":
        return { icon: "⏰", bgColor: "bg-error/10", textColor: "text-error" };
      default:
        return { icon: "📢", bgColor: "bg-muted", textColor: "text-muted-foreground" };
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded-md animate-pulse" />
          ))}
        </div>
        
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-muted rounded-md animate-pulse" />
        ))}
      </div>
    );
  }
  
  // Error state
  if (isError) {
    return (
      <div className="p-6 bg-muted rounded-lg text-center">
        <h3 className="text-lg font-medium mb-2">Failed to load notifications</h3>
        <p className="text-muted-foreground mb-4">
          An error occurred while loading your notifications.
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          placeholder="Search notifications..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
        
        <Select
          options={typeOptions}
          value={filters.type}
          onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
          placeholder="Filter by type"
        />
        
        <Select
          options={readOptions}
          value={filters.unread ? "unread" : "all"}
          onChange={(value) => setFilters(prev => ({ ...prev, unread: value === "unread" }))}
          placeholder="Filter by read status"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {filteredNotifications?.length || 0} notifications
          {filters.unread && ` (${notifications?.filter(n => !n.isRead).length || 0} unread)`}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllAsRead}
          disabled={!notifications?.some(n => !n.isRead)}
        >
          <CheckIcon className="h-4 w-4 mr-2" />
          Mark all as read
        </Button>
      </div>
      
      {filteredNotifications?.length === 0 ? (
        <div className="p-8 bg-muted/20 rounded-lg text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <MailOpenIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No notifications</h3>
          <p className="text-muted-foreground">
            {filters.search || filters.type || filters.unread
              ? "Try changing your filters"
              : "You don't have any notifications yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications?.map((notification, index) => {
            const { icon, bgColor, textColor } = getNotificationStyle(notification.type);
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`p-4 border border-border rounded-lg ${notification.isRead ? '' : 'bg-primary/5'}`}
              >
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full ${bgColor} ${textColor} flex items-center justify-center text-lg`}>
                    {icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className={`font-medium ${notification.isRead ? 'text-foreground' : 'text-primary'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                      
                      <div className="flex space-x-2">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <CheckIcon className="h-4 w-4 mr-2" />
                            Mark as read
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notification.id)}
                          className="text-muted-foreground hover:text-error hover:bg-error/10"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}