// src/app/(dashboard)/dosen/tickets/my/page.tsx
import { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { DosenMyTickets } from "@/components/dosen/dosen-my-tickets";

export const metadata: Metadata = {
  title: "My Tickets | Service Desk FIK",
  description: "View tickets you have created",
};

export default function DosenMyTicketsPage() {
  return (
    <div className="container">
      <PageHeader
        title="My Tickets"
        description="View tickets you have created as faculty"
        action={{
          label: "Create Ticket",
          href: "/dosen/tickets/create",
        }}
      />
      
      <div className="bg-background rounded-lg border border-border shadow-sm p-6">
        <DosenMyTickets />
      </div>
    </div>
  );
}