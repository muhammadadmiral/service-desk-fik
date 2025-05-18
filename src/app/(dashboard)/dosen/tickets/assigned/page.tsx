// src/app/(dashboard)/dosen/tickets/assigned/page.tsx
import { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { TicketList } from "@/components/tickets/ticket-list";

export const metadata: Metadata = {
  title: "Assigned Tickets | Service Desk FIK",
  description: "View and manage tickets assigned to you",
};

export default function AssignedTicketsPage() {
  return (
    <div className="container">
      <PageHeader
        title="Assigned Tickets"
        description="View and manage tickets assigned to you"
      />
      
      <TicketList 
        baseUrl="/dosen/tickets" 
        defaultFilters={{
          status: "in-progress", // Default to show in-progress tickets
        }}
      />
    </div>
  );
}