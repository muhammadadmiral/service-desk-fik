// src/components/shared/side-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  TicketIcon, 
  Users, 
  Settings, 
  BarChart, 
  PlusCircle,
  ListIcon,
  GitPullRequest,
  FileText
} from "lucide-react";
import { useUserProfile } from "@/hooks/api/users";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

export function SideNav() {
  const pathname = usePathname();
  const { data: user } = useUserProfile();
  
  const role = user?.role;
  
  if (!role) return null;
  
  // Navigation items based on user role
  const roleNavItems: Record<string, NavItem[]> = {
    mahasiswa: [
      {
        title: "Dashboard",
        href: "/mahasiswa/dashboard",
        icon: <Home className="h-5 w-5" />,
      },
      {
        title: "My Tickets",
        href: "/mahasiswa/tickets/my",
        icon: <ListIcon className="h-5 w-5" />,
      },
      {
        title: "Create Ticket",
        href: "/mahasiswa/tickets/create",
        icon: <PlusCircle className="h-5 w-5" />,
      },
    ],
    dosen: [
      {
        title: "Dashboard",
        href: "/dosen/dashboard",
        icon: <Home className="h-5 w-5" />,
      },
      {
        title: "Assigned Tickets",
        href: "/dosen/tickets/assigned",
        icon: <TicketIcon className="h-5 w-5" />,
      },
    ],
    admin: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: <Home className="h-5 w-5" />,
      },
      {
        title: "All Tickets",
        href: "/admin/tickets/all",
        icon: <TicketIcon className="h-5 w-5" />,
      },
      {
        title: "Users",
        href: "/admin/users",
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: <Settings className="h-5 w-5" />,
      },
      {
        title: "Templates",
        href: "/admin/templates",
        icon: <FileText className="h-5 w-5" />,
      },
    ],
    executive: [
      {
        title: "Dashboard",
        href: "/executive/dashboard",
        icon: <Home className="h-5 w-5" />,
      },
      {
        title: "Reports",
        href: "/executive/reports",
        icon: <BarChart className="h-5 w-5" />,
      },
      {
        title: "Workflows",
        href: "/executive/workflows",
        icon: <GitPullRequest className="h-5 w-5" />,
      },
    ],
  };
  
  const navItems = roleNavItems[role] || [];

  return (
    <div className="hidden sm:flex h-full w-64 flex-col bg-background border-r border-border">
      <div className="flex flex-col p-4">
        <div className="text-md font-medium text-muted-foreground uppercase mb-4 px-4">
          Menu
        </div>
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}