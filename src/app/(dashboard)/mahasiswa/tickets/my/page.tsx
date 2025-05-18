// src/app/(dashboard)/mahasiswa/tickets/my/page.tsx
import { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { TicketList } from "@/components/tickets/ticket-list";

export const metadata: Metadata = {
  title: "My Tickets | Service Desk FIK",
  description: "View and manage your service requests",
};

export default function MyTicketsPage() {
  return (
    <div className="container">
      <PageHeader
        title="My Tickets"
        description="View and manage your service requests"
        action={{
          label: "Create Ticket",
          href: "/mahasiswa/tickets/create",
        }}
      />
      
      <TicketList 
        baseUrl="/mahasiswa/tickets" 
        defaultFilters={{}} 
      />
    </div>
  );
}