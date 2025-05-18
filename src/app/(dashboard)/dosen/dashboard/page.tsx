// src/app/(dashboard)/dosen/dashboard/page.tsx
"use client";

import { Metadata } from "next";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { TicketList } from "@/components/tickets/ticket-list";
import { useAssignedTickets } from "@/hooks/api/tickets";
import { TicketIcon, Clock, AlertCircle, CheckCircle } from "lucide-react";

export default function DosenDashboardPage() {
  const { data: tickets, isLoading } = useAssignedTickets();
  
  // Calculate stats
  const totalAssigned = tickets?.length || 0;
  const inProgress = tickets?.filter(t => t.status === "in-progress").length || 0;
  const urgent = tickets?.filter(t => t.priority === "urgent").length || 0;
  const completedToday = tickets?.filter(t => {
    if (t.status !== "completed") return false;
    const today = new Date();
    const completedDate = new Date(t.updatedAt);
    return (
      completedDate.getDate() === today.getDate() &&
      completedDate.getMonth() === today.getMonth() &&
      completedDate.getFullYear() === today.getFullYear()
    );
  }).length || 0;
  
  // Recent tickets (last 5)
  const recentTickets = tickets
    ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="container">
      <PageHeader
        title="Faculty Dashboard"
        description="Overview of tickets assigned to you"
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8"
      >
        <StatsCard
          title="Assigned Tickets"
          value={totalAssigned}
          icon={<TicketIcon size={24} />}
        />
        <StatsCard
          title="In Progress"
          value={inProgress}
          icon={<Clock size={24} />}
        />
        <StatsCard
          title="Urgent"
          value={urgent}
          icon={<AlertCircle size={24} />}
        />
        <StatsCard
          title="Completed Today"
          value={completedToday}
          icon={<CheckCircle size={24} />}
        />
      </motion.div>
      
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Recent Assigned Tickets</h2>
        <div className="bg-background rounded-lg border border-border shadow-sm p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-muted h-16 rounded-md animate-pulse" />
              ))}
            </div>
          ) : recentTickets?.length ? (
            <TicketList 
              baseUrl="/dosen/tickets" 
              showActions={true} 
            />
          ) : (
            <div className="p-6 bg-muted/50 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-2">No tickets assigned</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any tickets assigned to you yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}