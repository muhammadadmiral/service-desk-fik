// src/app/(dashboard)/mahasiswa/tickets/create/page.tsx
import { Metadata } from "next";
import { CreateTicketForm } from "@/components/tickets/create-ticket-form";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Create Ticket | Service Desk FIK",
  description: "Submit a new service request or report an issue",
};

export default function CreateTicketPage() {
  return (
    <div className="container max-w-4xl mx-auto">
      <PageHeader
        title="Create New Ticket"
        description="Submit a new service request or report an issue"
      />
      
      <div className="bg-background rounded-lg border border-border shadow-sm p-6">
        <CreateTicketForm />
      </div>
    </div>
  );
}