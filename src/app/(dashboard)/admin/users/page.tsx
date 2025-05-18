// src/app/(dashboard)/admin/users/page.tsx
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { UserList } from "@/components/users/user-list";
import { UserForm } from "@/components/users/user-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@headlessui/react";
import { useUserById } from "@/hooks/api/users";

export default function AdminUsersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  
  // Get user data when editing
  const { data: editingUser, isLoading: isLoadingUser } = useUserById(editingUserId || 0, {
    enabled: !!editingUserId,
  });
  
  const handleCreateUser = () => {
    setIsCreateModalOpen(true);
  };
  
  const handleEditUser = (userId: number) => {
    setEditingUserId(userId);
  };
  
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingUserId(null);
  };

  return (
    <div className="container">
      <PageHeader
        title="User Management"
        description="Create and manage users across the system"
        action={{
          label: "Create User",
          href: "#",
          onClick: handleCreateUser,
        }}
      />
      
      <div className="bg-background rounded-lg border border-border shadow-sm p-6">
        <UserList 
          onCreateUser={handleCreateUser}
          onEditUser={handleEditUser}
        />
      </div>
      
      {/* Create User Modal */}
      <Dialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogContent className="w-full max-w-2xl rounded-lg bg-background p-6 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Create New User
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              <UserForm
                onSuccess={handleCloseModal}
                onCancel={handleCloseModal}
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>
      
      {/* Edit User Modal */}
      <Dialog
        open={!!editingUserId}
        onClose={() => setEditingUserId(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogContent className="w-full max-w-2xl rounded-lg bg-background p-6 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Edit User
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              {isLoadingUser ? (
                <div className="space-y-4 animate-pulse">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 bg-muted rounded-md" />
                  ))}
                </div>
              ) : (
                <UserForm
                  userId={editingUserId || undefined}
                  initialData={editingUser}
                  onSuccess={handleCloseModal}
                  onCancel={handleCloseModal}
                />
              )}
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
}