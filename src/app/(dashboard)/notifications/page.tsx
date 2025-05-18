// src/app/(dashboard)/notifications/page.tsx
import { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { NotificationList } from "@/components/notifications/notification-list";

export const metadata: Metadata = {
  title: "Notifications | Service Desk FIK",
  description: "View and manage your notifications",
};

export default function NotificationsPage() {
  return (
    <div className="container">
      <PageHeader
        title="Notifications"
        description="View and manage your notification history"
      />
      
      <div className="bg-background rounded-lg border border-border shadow-sm p-6">
        <NotificationList />
      </div>
    </div>
  );
}