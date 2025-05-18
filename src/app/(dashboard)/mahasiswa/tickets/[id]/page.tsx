// src/app/(dashboard)/mahasiswa/tickets/[id]/page.tsx
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
  description: "View ticket details and conversation",
};

export default function TicketPage({ params }: TicketPageProps) {
  const ticketId = parseInt(params.id);

  return (
    <div className="container">
      <PageHeader
        title="Ticket Details"
        description="View ticket details and conversation"
      />
      
      <TicketDetail ticketId={ticketId} />
    </div>
  );
}