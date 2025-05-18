// src/app/(dashboard)/admin/users/import/page.tsx
import { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { BulkUserImport } from "@/components/admin/bulk-user-import";

export const metadata: Metadata = {
  title: "Bulk User Import | Service Desk FIK",
  description: "Import multiple users at once",
};

export default function BulkUserImportPage() {
  return (
    <div className="container max-w-4xl mx-auto">
      <PageHeader
        title="Bulk User Import"
        description="Import multiple users at once using a CSV file"
      />
      
      <div className="bg-background rounded-lg border border-border shadow-sm p-6">
        <BulkUserImport />
      </div>
    </div>
  );
}