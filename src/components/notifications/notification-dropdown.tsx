// src/components/notifications/notification-dropdown.tsx
"use client";

import { useState, useEffect } from "react";
import { Popover } from "@headlessui/react";
import { BellIcon, CheckIcon, Trash2Icon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { 
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification
} from "@/hooks/api/notification";
import Link from "next/link";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications, isLoading } = useNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();
  
  // Count unread notifications
  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;
  
  // Handle notification click
  const handleNotificationClick = (id: number) => {
    // Mark as read when clicked
    if (!notifications?.find(n => n.id === id)?.isRead) {
      markAsRead(id);
    }
  };
  
  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };
  
  // Handle delete notification
  const handleDeleteNotification = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent notification click handler
    deleteNotification(id);
  };
  
  // Determine notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ticket_assigned":
        return <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">🎫</div>;
      case "ticket_disposisi":
        return <div className="h-8 w-8 rounded-full bg-warning/10 text-warning flex items-center justify-center">↪️</div>;
      case "ticket_completed":
        return <div className="h-8 w-8 rounded-full bg-success/10 text-success flex items-center justify-center">✅</div>;
      case "ticket_message_added":
        return <div className="h-8 w-8 rounded-full bg-info/10 text-info flex items-center justify-center">💬</div>;
      case "sla_breach":
        return <div className="h-8 w-8 rounded-full bg-error/10 text-error flex items-center justify-center">⏰</div>;
      default:
        return <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">📢</div>;
    }
  };
  
  return (
    <Popover className="relative">
      {({ open }) => {
        useEffect(() => {
          setIsOpen(open);
        }, [open]);
        
        return (
          <>
            <Popover.Button
              className="rounded-full bg-background p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 relative"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-error text-white text-xs flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Popover.Button>
            
            <AnimatePresence>
              {isOpen && (
                <Popover.Panel
                  static
                  as={motion.div}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium">Notifications</h3>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleMarkAllAsRead}
                          className="text-xs"
                        >
                          <CheckIcon className="h-3 w-3 mr-1" />
                          Mark all as read
                        </Button>
                      )}
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto space-y-2">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                        </div>
                      ) : notifications?.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          No notifications
                        </div>
                      ) : (
                        notifications?.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification.id)}
                            className={`p-3 rounded-md ${
                              notification.isRead ? 'bg-background' : 'bg-primary/5'
                            } hover:bg-muted cursor-pointer relative group`}
                          >
                            <div className="flex items-start gap-3">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${
                                  notification.isRead ? 'text-foreground' : 'text-primary'
                                }`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 break-words">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </p>
                              </div>
                              <button
                                onClick={(e) => handleDeleteNotification(e, notification.id)}
                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-error transition-opacity"
                              >
                                <Trash2Icon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-border">
                      <Link
                        href="/notifications"
                        className="text-sm text-primary hover:text-primary-dark transition-colors block text-center"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                </Popover.Panel>
              )}
            </AnimatePresence>
          </>
        );
      }}
    </Popover>
  );
}