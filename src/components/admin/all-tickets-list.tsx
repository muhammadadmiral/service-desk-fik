// src/components/admin/all-tickets-list.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/tickets/status-badge";
import { PriorityBadge } from "@/components/tickets/priority-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useTickets } from "@/hooks/api/tickets";
import { formatDistanceToNow } from "date-fns";
import { Download, Filter, RefreshCw } from "lucide-react";

export function AllTicketsList() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
    department: "",
    assignedTo: "",
    search: "",
    page: 1,
    limit: 10,
  });
  
  const { data: ticketsData, isLoading, isError, refetch } = useTickets(filters);
  const tickets = ticketsData?.data || [];
  const totalTickets = ticketsData?.total || 0;
  const totalPages = ticketsData?.totalPages || 1;
  
  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };
  
  const handleExport = () => {
    // Here you would call your export API
    alert("Exporting tickets... This would download a file in a real implementation.");
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
  
  // Department filter options
  const departmentOptions = [
    { label: "All Departments", value: "" },
    { label: "Informatika", value: "Informatika" },
    { label: "Sistem Informasi", value: "Sistem Informasi" },
    { label: "Fasilitas", value: "Fasilitas" },
    { label: "Keuangan", value: "Keuangan" },
    { label: "Akademik", value: "Akademik" },
  ];
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }
  
  // Empty state
  if (tickets.length === 0) {
    return (
      <div className="p-6 bg-muted/50 rounded-lg text-center">
        <h3 className="text-lg font-medium mb-2">No tickets found</h3>
        <p className="text-muted-foreground mb-4">
          {Object.values(filters).some(v => v && v !== 1 && v !== 10)
            ? "Try changing your filters or search terms."
            : "No tickets have been created yet."}
        </p>
        <Button onClick={() => setFilters({
          status: "",
          category: "",
          priority: "",
          department: "",
          assignedTo: "",
          search: "",
          page: 1,
          limit: 10,
        })}>
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Input
          placeholder="Search tickets..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
        
        <Select
          options={statusOptions}
          value={filters.status}
          onChange={(value) => handleFilterChange("status", value)}
          placeholder="Status"
        />
        
        <Select
          options={priorityOptions}
          value={filters.priority}
          onChange={(value) => handleFilterChange("priority", value)}
          placeholder="Priority"
        />
        
        <Select
          options={categoryOptions}
          value={filters.category}
          onChange={(value) => handleFilterChange("category", value)}
          placeholder="Category"
        />
        
        <Select
          options={departmentOptions}
          value={filters.department}
          onChange={(value) => handleFilterChange("department", value)}
          placeholder="Department"
        />
      </div>
      
      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {filters.page === 1 ? 1 : (filters.page - 1) * filters.limit + 1} to {Math.min(filters.page * filters.limit, totalTickets)} of {totalTickets} tickets
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Tickets Table */}
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ticket
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Priority
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {tickets.map((ticket, index) => (
              <motion.tr
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium">
                      {ticket.subject}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {ticket.ticketNumber}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {ticket.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    size="sm"
                    variant="outline"
                    as={Link}
                    href={`/admin/tickets/${ticket.id}`}
                  >
                    View
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
              disabled={filters.page === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (filters.page <= 3) {
                pageNum = i + 1;
              } else if (filters.page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = filters.page - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={filters.page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.min(totalPages, filters.page + 1))}
              disabled={filters.page === totalPages}
            >
              Next
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
}