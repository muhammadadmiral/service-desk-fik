// src/app/(dashboard)/admin/users/create/page.tsx
import { Metadata } from "next";
import { UserCreationForm } from "@/components/admin/user-creation-form";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Create User | Service Desk FIK",
  description: "Create a new user in the system",
};

export default function CreateUserPage() {
  return (
    <div className="container max-w-4xl mx-auto">
      <PageHeader
        title="Create New User"
        description="Add a new user to the Service Desk system"
      />
      
      <div className="bg-background rounded-lg border border-border shadow-sm p-6">
        <UserCreationForm />
      </div>
    </div>
  );
}