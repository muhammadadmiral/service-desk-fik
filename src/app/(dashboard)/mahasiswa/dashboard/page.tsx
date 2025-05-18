// src/app/(dashboard)/mahasiswa/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { Metadata } from "next";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { TicketList } from "@/components/tickets/ticket-list";
import { useMyTickets } from "@/hooks/api/tickets";
import { TicketIcon, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function MahasiswaDashboardPage() {
  const { data: tickets, isLoading } = useMyTickets();
  
  // Calculate stats
  const totalTickets = tickets?.length || 0;
  const openTickets = tickets?.filter(t => 
    t.status !== "completed" && t.status !== "cancelled"
  ).length || 0;
  const completedTickets = tickets?.filter(t => t.status === "completed").length || 0;
  const pendingTickets = tickets?.filter(t => t.status === "pending").length || 0;
  
  // Recent tickets (last 5)
  const recentTickets = tickets
    ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="container">
      <PageHeader
        title="Student Dashboard"
        description="Overview of your service requests"
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8"
      >
        <StatsCard
          title="Total Tickets"
          value={totalTickets}
          icon={<TicketIcon size={24} />}
        />
        <StatsCard
          title="Open Tickets"
          value={openTickets}
          icon={<Clock size={24} />}
        />
        <StatsCard
          title="Completed"
          value={completedTickets}
          icon={<CheckCircle size={24} />}
        />
        <StatsCard
          title="Pending"
          value={pendingTickets}
          icon={<AlertTriangle size={24} />}
        />
      </motion.div>
      
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Recent Tickets</h2>
        <div className="bg-background rounded-lg border border-border shadow-sm p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-muted h-16 rounded-md animate-pulse" />
              ))}
            </div>
          ) : recentTickets?.length ? (
            <TicketList 
              baseUrl="/mahasiswa/tickets" 
              showActions={true} 
            />
          ) : (
            <div className="p-6 bg-muted/50 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-2">No tickets yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't created any tickets yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}