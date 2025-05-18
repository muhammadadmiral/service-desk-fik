// src/app/(dashboard)/admin/dashboard/page.tsx
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { motion } from "framer-motion";
import { StatsCard } from "@/components/shared/stats-card";
import { TicketIcon, Clock, AlertCircle, CheckCircle, Users } from "lucide-react";
import { useDashboardStats } from "@/hooks/api/tickets";
import { useUsers } from "@/hooks/api/users";
import { TicketList } from "@/components/tickets/ticket-list";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

export default function AdminDashboardPage() {
  // Fetch dashboard statistics
  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();
  
  // Fetch recent users
  const { data: users, isLoading: isLoadingUsers } = useUsers({
    limit: 5,
    sort: "createdAt:desc",
  });
  
  // Sample data for ticket trend (normally would come from API)
  const ticketTrendData = [
    { date: "Mon", created: 4, resolved: 2 },
    { date: "Tue", created: 7, resolved: 5 },
    { date: "Wed", created: 5, resolved: 6 },
    { date: "Thu", created: 10, resolved: 8 },
    { date: "Fri", created: 8, resolved: 7 },
    { date: "Sat", created: 3, resolved: 5 },
    { date: "Sun", created: 2, resolved: 3 },
  ];
  
  // Sample data for category breakdown (normally would come from API)
  const categoryData = stats?.byCategory || [];

  return (
    <div className="container">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of system activity and metrics"
      />
      
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8"
      >
        <StatsCard
          title="Total Tickets"
          value={stats?.total || 0}
          icon={<TicketIcon size={24} />}
        />
        <StatsCard
          title="Open Tickets"
          value={stats?.byStatus?.find(s => s.status === "pending")?.count || 0}
          icon={<Clock size={24} />}
        />
        <StatsCard
          title="In Progress"
          value={stats?.byStatus?.find(s => s.status === "in-progress")?.count || 0}
          icon={<AlertCircle size={24} />}
        />
        <StatsCard
          title="Completed"
          value={stats?.byStatus?.find(s => s.status === "completed")?.count || 0}
          icon={<CheckCircle size={24} />}
        />
      </motion.div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Ticket Trend */}
        <div className="bg-background p-6 rounded-lg border border-border">
          <h3 className="text-lg font-medium mb-4">Weekly Ticket Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ticketTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="created" 
                  stroke="#FFA500" 
                  name="Created" 
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#355E3B" 
                  name="Resolved" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Category Breakdown */}
        <div className="bg-background p-6 rounded-lg border border-border">
          <h3 className="text-lg font-medium mb-4">Tickets by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#FFA500" name="Tickets" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Tickets */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Recent Tickets</h3>
        <div className="bg-background rounded-lg border border-border p-6">
          <TicketList 
            baseUrl="/admin/tickets" 
            defaultFilters={{}} 
            showActions={true}
          />
        </div>
      </div>
      
      {/* Recent Users */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Recent Users</h3>
        <div className="bg-background rounded-lg border border-border overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Department
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {isLoadingUsers ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-8 bg-muted rounded-md animate-pulse" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-8 bg-muted rounded-md animate-pulse" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-8 bg-muted rounded-md animate-pulse" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-8 bg-muted rounded-md animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : (
                users?.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        bg-primary/10 text-primary">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {user.department || "-"}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}