// src/app/(dashboard)/executive/dashboard/page.tsx
import { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ExecutiveDashboard } from "@/components/executive/executive-dashboard";

export const metadata: Metadata = {
  title: "Executive Dashboard | Service Desk FIK",
  description: "Comprehensive metrics and analytics for executive decision-making",
};

export default function ExecutiveDashboardPage() {
  return (
    <div className="container">
      <PageHeader
        title="Executive Dashboard"
        description="Comprehensive metrics and analytics for executive decision-making"
      />
      
      <ExecutiveDashboard />
    </div>
  );
}