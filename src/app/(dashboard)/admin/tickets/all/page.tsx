// src/app/(dashboard)/admin/tickets/all/page.tsx
import { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { AllTicketsList } from "@/components/admin/all-tickets-list";

export const metadata: Metadata = {
  title: "All Tickets | Service Desk FIK",
  description: "Manage all tickets in the system",
};

export default function AdminAllTicketsPage() {
  return (
    <div className="container">
      <PageHeader
        title="All Tickets"
        description="Manage all tickets in the system"
      />
      
      <div className="bg-background rounded-lg border border-border shadow-sm p-6">
        <AllTicketsList />
      </div>
    </div>
  );
}