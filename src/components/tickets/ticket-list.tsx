// src/components/tickets/ticket-list.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { StatusBadge } from "./status-badge";
import { PriorityBadge } from "./priority-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useTickets } from "@/hooks/api/tickets";
import { formatDistanceToNow } from "date-fns";

type TicketListProps = {
  baseUrl?: string;
  defaultFilters?: Record<string, string>;
  showActions?: boolean;
};

export function TicketList({ 
  baseUrl = "/tickets", 
  defaultFilters = {}, 
  showActions = true 
}: TicketListProps) {
  const router = useRouter();
  const [filters, setFilters] = useState({
    status: defaultFilters.status || "",
    category: defaultFilters.category || "",
    priority: defaultFilters.priority || "",
    search: "",
  });
  
  const { data: tickets, isLoading, isError } = useTickets(filters);
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Status filter options
  const statusOptions = [
    { label: "All Statuses", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Disposisi", value: "disposisi" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];
  
  // Priority filter options
  const priorityOptions = [
    { label: "All Priorities", value: "" },
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Urgent", value: "urgent" },
  ];
  
  // Category filter options
  const categoryOptions = [
    { label: "All Categories", value: "" },
    { label: "Academic", value: "Academic" },
    { label: "Financial", value: "Financial" },
    { label: "Facility", value: "Facility" },
    { label: "IT Support", value: "IT Support" },
  ];
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-muted h-10 rounded-md animate-pulse" />
          ))}
        </div>
        
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-muted animate-pulse h-20 rounded-md"
          />
        ))}
      </div>
    );
  }
  
  // Error state
  if (isError) {
    return (
      <div className="p-6 bg-muted rounded-lg text-center">
        <h3 className="text-lg font-medium mb-2">Failed to load tickets</h3>
        <p className="text-muted-foreground mb-4">
          An error occurred while loading the ticket list.
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }
  
  // Empty state
  if (tickets?.length === 0) {
    return (
      <div className="p-6 bg-muted/50 rounded-lg text-center">
        <h3 className="text-lg font-medium mb-2">No tickets found</h3>
        <p className="text-muted-foreground mb-4">
          {filters.search || filters.status || filters.category || filters.priority
            ? "Try changing your filters or search terms."
            : "No tickets have been created yet."}
        </p>
        <Button as={Link} href="/mahasiswa/tickets/create">
          Create New Ticket
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search tickets..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
        
        <Select
          options={statusOptions}
          value={filters.status}
          onChange={(value) => handleFilterChange("status", value)}
          placeholder="Filter by status"
        />
        
        <Select
          options={priorityOptions}
          value={filters.priority}
          onChange={(value) => handleFilterChange("priority", value)}
          placeholder="Filter by priority"
        />
      </div>
      
      <div className="space-y-4">
        {tickets?.map((ticket, index) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <div className="p-4 bg-background border border-border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`${baseUrl}/${ticket.id}`}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {ticket.subject}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {ticket.ticketNumber}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {ticket.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                
                {showActions && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      as={Link}
                      href={`${baseUrl}/${ticket.id}`}
                    >
                      View Details
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}