// src/components/shared/mobile-nav.tsx
"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { 
  XIcon, 
  MenuIcon, 
  Home, 
  TicketIcon,
  Users,
  Settings,
  BarChart,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserProfile } from "@/hooks/api/users";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: user } = useUserProfile();
  
  if (!user) return null;
  
  const role = user.role;
  
  // Navigation items based on user role
  const roleNavItems: Record<string, { title: string; href: string; icon: JSX.Element }[]> = {
    mahasiswa: [
      {
        title: "Dashboard",
        href: "/mahasiswa/dashboard",
        icon: <Home className="h-5 w-5" />,
      },
      {
        title: "My Tickets",
        href: "/mahasiswa/tickets/my",
        icon: <TicketIcon className="h-5 w-5" />,
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
      {
        title: "My Tickets",
        href: "/dosen/tickets/my",
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
    ],
  };
  
  const navItems = roleNavItems[role] || [];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        onClick={() => setOpen(true)}
      >
        <span className="sr-only">Open menu</span>
        <MenuIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>
          
          <div className="fixed inset-0 z-50 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-background pb-12 shadow-xl">
                <div className="flex px-4 pt-5 pb-2">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-muted-foreground"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                {/* User profile */}
                <div className="px-4 py-6 border-b border-border">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </div>
                
                {/* Navigation */}
                <div className="space-y-6 px-4 py-6">
                  <div className="flow-root">
                    <ul className="-my-2 space-y-1">
                      {navItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium",
                              pathname === item.href || pathname.startsWith(`${item.href}/`)
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                            onClick={() => setOpen(false)}
                          >
                            {item.icon}
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Sign out */}
                <div className="border-t border-border px-4 py-6">
                  <button
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-5 w-5" />
                    Sign out
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}