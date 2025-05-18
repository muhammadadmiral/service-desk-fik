// src/components/shared/top-nav.tsx
"use client";

import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUserProfile } from "@/hooks/api/users";
import { cn } from "@/lib/utils";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { signOut } from "next-auth/react";

export function TopNav() {
  const pathname = usePathname();
  const { data: user } = useUserProfile();
  
  const navigation = [
    { name: "Dashboard", href: `/${user?.role}/dashboard` },
    { name: "Tickets", href: `/${user?.role}/tickets` },
  ];
  
  if (user?.role === "admin" || user?.role === "executive") {
    navigation.push({ name: "Users", href: `/${user.role}/users` });
  }
  
  if (user?.role === "admin") {
    navigation.push({ name: "Settings", href: "/admin/settings" });
  }
  
  if (user?.role === "executive") {
    navigation.push({ name: "Reports", href: "/executive/reports" });
  }
  
  if (user?.role === "dosen") {
    navigation.push({ name: "My Tickets", href: "/dosen/tickets/my" });
  }

  return (
    <Disclosure as="nav" className="bg-background border-b border-border">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/">
                    <Image
                      className="block h-8 w-auto"
                      src="/logo-upnvj.svg"
                      alt="Service Desk FIK"
                      width={32}
                      height={32}
                    />
                  </Link>
                  <span className="ml-2 text-lg font-semibold hidden sm:block">Service Desk FIK</span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        pathname.startsWith(item.href)
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                        "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                {/* Notification dropdown */}
                <NotificationDropdown />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button className="flex rounded-full bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-background py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profile"
                            className={cn(
                              active ? "bg-muted" : "",
                              "block px-4 py-2 text-sm text-foreground"
                            )}
                          >
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/notifications"
                            className={cn(
                              active ? "bg-muted" : "",
                              "block px-4 py-2 text-sm text-foreground"
                            )}
                          >
                            Notifications
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/settings"
                            className={cn(
                              active ? "bg-muted" : "",
                              "block px-4 py-2 text-sm text-foreground"
                            )}
                          >
                            Settings
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => signOut()}
                            className={cn(
                              active ? "bg-muted" : "",
                              "block w-full text-left px-4 py-2 text-sm text-foreground"
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              
              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden">
                <NotificationDropdown />
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 ml-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={cn(
                    pathname.startsWith(item.href)
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:bg-muted hover:border-muted hover:text-foreground",
                    "block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-border pb-3 pt-4">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-foreground">{user?.name}</div>
                  <div className="text-sm font-medium text-muted-foreground">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Disclosure.Button
                  as="a"
                  href="/profile"
                  className="block px-4 py-2 text-base font-medium text-foreground hover:bg-muted"
                >
                  Your Profile
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="/notifications"
                  className="block px-4 py-2 text-base font-medium text-foreground hover:bg-muted"
                >
                  Notifications
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="/settings"
                  className="block px-4 py-2 text-base font-medium text-foreground hover:bg-muted"
                >
                  Settings
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="/api/auth/signout"
                  className="block px-4 py-2 text-base font-medium text-foreground hover:bg-muted"
                >
                  Sign out
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}