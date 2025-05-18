// src/app/(dashboard)/admin/settings/page.tsx
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { Tab } from "@headlessui/react";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  
  // Define settings categories
  const categories = [
    {
      id: "general",
      label: "General",
      description: "Basic system configuration settings",
    },
    {
      id: "ticket",
      label: "Tickets",
      description: "Ticket creation and handling settings",
    },
    {
      id: "sla",
      label: "SLA",
      description: "Service Level Agreement configuration",
    },
    {
      id: "notification",
      label: "Notifications",
      description: "Email and notification settings",
    },
  ];

  return (
    <div className="container">
      <PageHeader
        title="System Settings"
        description="Configure system-wide settings and preferences"
      />
      
      <div className="bg-background rounded-lg border border-border shadow-sm">
        <div className="md:grid md:grid-cols-4 md:gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 bg-muted/30 p-6 border-r border-border">
            <nav className="space-y-1">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    selectedCategory === index
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => setSelectedCategory(index)}
                >
                  {category.label}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-3 p-6">
            <Tab.Group selectedIndex={selectedCategory} onChange={setSelectedCategory}>
              <Tab.Panels>
                {categories.map((category) => (
                  <Tab.Panel key={category.id}>
                    <SettingsForm
                      category={category.id}
                      title={category.label}
                      description={category.description}
                    />
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </div>
  );
}