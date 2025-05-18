// src/app/(dashboard)/dosen/tickets/[id]/page.tsx
import { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { TicketDetail } from "@/components/tickets/ticket-detail";

interface TicketPageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: "Ticket Details | Service Desk FIK",
  description: "View and manage ticket details",
};

export default function DosenTicketPage({ params }: TicketPageProps) {
  const ticketId = parseInt(params.id);

  return (
    <div className="container">
      <PageHeader
        title="Ticket Details"
        description="View and manage ticket details"
      />
      
      <TicketDetail 
        ticketId={ticketId} 
        canDisposisi={true} 
        canUpdate={true} 
      />
    </div>
  );
}