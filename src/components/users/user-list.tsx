// src/components/users/user-list.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useUsers } from "@/hooks/api/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EditIcon, TrashIcon, UserPlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface UserListProps {
  onEditUser?: (userId: number) => void;
  onCreateUser?: () => void;
}

export function UserList({ onEditUser, onCreateUser }: UserListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    role: "",
    department: "",
    search: "",
  });
  
  const { data: users, isLoading, isError } = useUsers(filters);
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Role filter options
  const roleOptions = [
    { label: "All Roles", value: "" },
    { label: "Mahasiswa", value: "mahasiswa" },
    { label: "Dosen", value: "dosen" },
    { label: "Admin", value: "admin" },
    { label: "Executive", value: "executive" },
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
  
  // Handle deletion (with confirmation)
  const handleDeleteUser = (userId: number, userName: string) => {
    if (window.confirm(`Are you sure you want to delete the user "${userName}"?`)) {
      // Here you would call your delete user API
      toast({
        title: "User deleted",
        description: `User "${userName}" has been deleted successfully`,
        variant: "success",
      });
      
      // Refresh the list
      router.refresh();
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
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
        <h3 className="text-lg font-medium mb-2">Failed to load users</h3>
        <p className="text-muted-foreground mb-4">
          An error occurred while loading the user list.
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }
  
  // Empty state
  if (users?.length === 0) {
    return (
      <div className="p-6 bg-muted/50 rounded-lg text-center">
        <h3 className="text-lg font-medium mb-2">No users found</h3>
        <p className="text-muted-foreground mb-4">
          {filters.search || filters.role || filters.department
            ? "Try changing your filters or search terms."
            : "No users have been created yet."}
        </p>
        <Button onClick={onCreateUser}>
          <UserPlusIcon className="h-4 w-4 mr-2" />
          Create New User
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search users..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
        
        <Select
          options={roleOptions}
          value={filters.role}
          onChange={(value) => handleFilterChange("role", value)}
          placeholder="Filter by role"
        />
        
        <Select
          options={departmentOptions}
          value={filters.department}
          onChange={(value) => handleFilterChange("department", value)}
          placeholder="Filter by department"
        />
      </div>
      
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Department
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ID/NIM
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {users?.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-foreground">
                        {user.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {user.nim || user.nip || user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEditUser && onEditUser(user.id)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-error hover:text-error/80 hover:bg-error/10"
                      onClick={() => handleDeleteUser(user.id, user.name)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}