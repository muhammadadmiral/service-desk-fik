// src/components/executive/executive-dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StatsCard } from "@/components/shared/stats-card";
import { 
  TicketIcon, Clock, AlertCircle, CheckCircle, 
  TrendingUp, BarChart, PieChart, Calendar,
  Download
} from "lucide-react";
import { useExecutiveDashboard } from "@/hooks/api/metrics";
import { 
  LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell
} from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { format, subDays } from "date-fns";

// Custom date picker input component
function DateInput({ label, value, onChange }: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex items-center">
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
}

// Colors for pie chart
const COLORS = ["#FFA500", "#355E3B", "#8A9A5B", "#FFD700", "#718096"];

export function ExecutiveDashboard() {
  // Date range for filtering (default to last 30 days)
  const [dateRange, setDateRange] = useState({
    from: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  });
  
  // Department filter
  const [department, setDepartment] = useState("");
  
  // Fetch dashboard data
  const { data, isLoading, isError, refetch } = useExecutiveDashboard({
    dateFrom: dateRange.from,
    dateTo: dateRange.to,
    department,
  });
  
  // Department options
  const departmentOptions = [
    { label: "All Departments", value: "" },
    { label: "Informatika", value: "Informatika" },
    { label: "Sistem Informasi", value: "Sistem Informasi" },
    { label: "Fasilitas", value: "Fasilitas" },
    { label: "Keuangan", value: "Keuangan" },
    { label: "Akademik", value: "Akademik" },
  ];
  
  // Preset date ranges
  const datePresets = [
    { label: "Last 7 Days", days: 7 },
    { label: "Last 30 Days", days: 30 },
    { label: "Last 90 Days", days: 90 },
  ];
  
  // Apply date preset
  const applyDatePreset = (days: number) => {
    setDateRange({
      from: format(subDays(new Date(), days), "yyyy-MM-dd"),
      to: format(new Date(), "yyyy-MM-dd"),
    });
  };
  
  // Handle filter update
  const handleFilterUpdate = () => {
    refetch();
  };
  
  // Prepare data for charts
  const trendData = data?.trendsOverTime ? 
    data.trendsOverTime.dates.map((date, index) => ({
      date,
      newTickets: data.trendsOverTime.newTickets[index],
      resolvedTickets: data.trendsOverTime.resolvedTickets[index],
    })) : [];
  
  const departmentData = data?.departmentPerformance || [];
  
  const categoryData = data?.categoryBreakdown.map(item => ({
    name: item.subcategory ? `${item.category}: ${item.subcategory}` : item.category,
    value: item.count,
  })) || [];
  
  // Format data for top performers chart
  const topPerformers = data?.userPerformance?.slice(0, 5).map(user => ({
    name: user.userName,
    tickets: user.ticketsHandled,
    resolution: Math.round(user.avgResolutionTime / 60), // Convert minutes to hours
    satisfaction: user.satisfaction,
  })) || [];
  
  // Effect to refetch data when filters change
  useEffect(() => {
    refetch();
  }, [dateRange.from, dateRange.to, department, refetch]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-80 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  
  // Error state
  if (isError) {
    return (
      <div className="p-6 bg-muted rounded-lg text-center">
        <h3 className="text-lg font-medium mb-2">Failed to load dashboard data</h3>
        <p className="text-muted-foreground mb-4">
          An error occurred while loading the executive dashboard metrics.
        </p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-background rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Dashboard Filters</h3>
          <div className="flex space-x-2">
            {datePresets.map(preset => (
              <Button
                key={preset.days}
                variant="outline"
                size="sm"
                onClick={() => applyDatePreset(preset.days)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DateInput
            label="Date From"
            value={dateRange.from}
            onChange={(value) => setDateRange(prev => ({ ...prev, from: value }))}
          />
          <DateInput
            label="Date To"
            value={dateRange.to}
            onChange={(value) => setDateRange(prev => ({ ...prev, to: value }))}
          />
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <Select
              options={departmentOptions}
              value={department}
              onChange={setDepartment}
              placeholder="Select department"
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            size="sm"
            className="mr-2"
            onClick={() => {
              // Simulate export functionality
              alert("Data would be exported here in a real implementation");
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={handleFilterUpdate}>
            Apply Filters
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard
          title="Total Tickets"
          value={data?.overallMetrics.totalTickets || 0}
          icon={<TicketIcon size={24} />}
          trend={{
            value: 12, // This would be calculated based on previous period
            label: "vs last period"
          }}
        />
        <StatsCard
          title="Open Tickets"
          value={data?.overallMetrics.openTickets || 0}
          icon={<Clock size={24} />}
          trend={{
            value: -5, // Negative is better for open tickets
            label: "vs last period"
          }}
        />
        <StatsCard
          title="SLA Breach Rate"
          value={`${data?.overallMetrics.slaBreachRate || 0}%`}
          icon={<AlertCircle size={24} />}
          trend={{
            value: -2.1, // Negative is better for breach rate
            label: "vs last period"
          }}
        />
        <StatsCard
          title="Avg. Satisfaction"
          value={(data?.overallMetrics.customerSatisfactionAvg || 0).toFixed(1)}
          description="Out of 5"
          icon={<CheckCircle size={24} />}
          trend={{
            value: 0.3, // Positive is better for satisfaction
            label: "vs last period"
          }}
        />
      </motion.div>
      
      {/* Charts - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-background p-6 rounded-lg border border-border shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Ticket Trends
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.375rem'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="newTickets" 
                  stroke="#FFA500" 
                  name="New Tickets" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="resolvedTickets" 
                  stroke="#355E3B" 
                  name="Resolved Tickets" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Department Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-background p-6 rounded-lg border border-border shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-primary" />
              Department Performance
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="department" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.375rem'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="ticketCount" 
                  fill="#FFA500" 
                  name="Ticket Count" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="avgResolutionTime" 
                  fill="#355E3B" 
                  name="Avg. Resolution Time (min)" 
                  radius={[4, 4, 0, 0]}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      
      {/* Charts - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-background p-6 rounded-lg border border-border shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-primary" />
              Category Breakdown
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.375rem'
                  }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-background p-6 rounded-lg border border-border shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Top Performers
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={topPerformers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number"
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.375rem'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="tickets" 
                  fill="#FFA500" 
                  name="Tickets Handled" 
                  radius={[0, 4, 4, 0]}
                />
                <Bar 
                  dataKey="satisfaction" 
                  fill="#355E3B" 
                  name="Satisfaction (1-5)" 
                  radius={[0, 4, 4, 0]}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      
      {/* Top Performing Users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-background p-6 rounded-lg border border-border shadow-sm"
      >
        <h3 className="text-lg font-medium mb-4">User Performance Metrics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-muted">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tickets Handled
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Avg. Resolution Time
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Satisfaction
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  SLA Breaches
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {data?.userPerformance?.map((user, index) => (
                <tr key={user.userId} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {user.ticketsHandled}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {Math.floor(user.avgResolutionTime / 60)}h {user.avgResolutionTime % 60}m
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className="flex items-center justify-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.satisfaction >= 4.5 ? 'bg-success/10 text-success' :
                        user.satisfaction >= 4 ? 'bg-primary/10 text-primary' :
                        user.satisfaction >= 3 ? 'bg-warning/10 text-warning' :
                        'bg-error/10 text-error'
                      }`}>
                        {user.satisfaction.toFixed(1)}/5
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      Number(user.slaBreaches || 0) === 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                    }`}>
                      {user.slaBreaches || 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}