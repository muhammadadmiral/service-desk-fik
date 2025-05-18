// src/components/admin/user-creation-form.tsx
"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { CheckCircle, AlertCircle } from "lucide-react";

// Validation schema with conditional fields
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["mahasiswa", "dosen", "admin", "executive"]),
  department: z.string().optional(),
  position: z.string().optional(),
  nim: z.string().optional(),
  nip: z.string().optional(),
})
.refine(data => {
  // If role is mahasiswa, nim is required
  if (data.role === "mahasiswa" && !data.nim) {
    return false;
  }
  // If role is dosen, nip is required
  if (data.role === "dosen" && !data.nip) {
    return false;
  }
  return true;
}, {
  message: "NIM or NIP is required based on the selected role",
  path: ["nim"],
});

type UserFormValues = z.infer<typeof userSchema>;

export function UserCreationForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "mahasiswa",
      department: "",
      position: "",
      nim: "",
      nip: "",
    },
  });
  
  const selectedRole = watch("role");
  
  // Role options
  const roleOptions = [
    { label: "Mahasiswa", value: "mahasiswa" },
    { label: "Dosen", value: "dosen" },
    { label: "Admin", value: "admin" },
    { label: "Executive", value: "executive" },
  ];
  
  // Department options
  const departmentOptions = [
    { label: "Informatika", value: "Informatika" },
    { label: "Sistem Informasi", value: "Sistem Informasi" },
    { label: "Fasilitas", value: "Fasilitas" },
    { label: "Keuangan", value: "Keuangan" },
    { label: "Akademik", value: "Akademik" },
  ];
  
  // Position options (for dosen and executive)
  const positionOptions = [
    { label: "Kaprodi", value: "Kaprodi" },
    { label: "Sekprodi", value: "Sekprodi" },
    { label: "Dosen", value: "Dosen" },
    { label: "Wadek 1", value: "Wadek 1" },
    { label: "Wadek 2", value: "Wadek 2" },
    { label: "Wadek 3", value: "Wadek 3" },
    { label: "Dekan", value: "Dekan" },
  ];
  
  const onSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Call the API to create a user
      await apiClient.users.adminCreate(values);
      
      // Show success toast
      toast({
        title: "User created successfully",
        description: `${values.name} has been added to the system`,
        variant: "success",
      });
      
      // Show success state
      setCreationSuccess(true);
      
      // Redirect after a delay
      setTimeout(() => {
        router.push("/admin/users");
      }, 2000);
    } catch (error: any) {
      console.error("Error creating user:", error);
      
      // Show error toast
      toast({
        title: "Failed to create user",
        description: error.response?.data?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If creation was successful, show success message
  if (creationSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold mb-2">User Created Successfully!</h2>
        <p className="text-muted-foreground mb-6">
          The new user account has been created and is now active in the system.
        </p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/users/create")}
          >
            Create Another User
          </Button>
          <Button onClick={() => router.push("/admin/users")}>
            View All Users
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Full Name <span className="text-error">*</span>
                </label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...register("name")}
                  error={errors.name?.message}
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address <span className="text-error">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                  error={errors.email?.message}
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password <span className="text-error">*</span>
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  error={errors.password?.message}
                  disabled={isSubmitting}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Must be at least 6 characters
                </p>
              </div>
            </div>
            
            {/* Role & Department */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Role & Department</h3>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-1">
                  User Role <span className="text-error">*</span>
                </label>
                <Controller
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <Select
                      options={roleOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select role"
                      error={errors.role?.message}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </div>
              
              <div>
                <label htmlFor="department" className="block text-sm font-medium mb-1">
                  Department
                </label>
                <Controller
                  control={control}
                  name="department"
                  render={({ field }) => (
                    <Select
                      options={departmentOptions}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Select department"
                      error={errors.department?.message}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </div>
              
              {/* Position field for dosen and executive */}
              {(selectedRole === "dosen" || selectedRole === "executive") && (
                <div>
                  <label htmlFor="position" className="block text-sm font-medium mb-1">
                    Position
                  </label>
                  <Controller
                    control={control}
                    name="position"
                    render={({ field }) => (
                      <Select
                        options={positionOptions}
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Select position"
                        error={errors.position?.message}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Role-specific fields */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-medium mb-4">Role-Specific Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NIM for students */}
              {selectedRole === "mahasiswa" && (
                <div>
                  <label htmlFor="nim" className="block text-sm font-medium mb-1">
                    NIM <span className="text-error">*</span>
                  </label>
                  <Input
                    id="nim"
                    placeholder="21105101001"
                    {...register("nim")}
                    error={errors.nim?.message}
                    disabled={isSubmitting}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    11-digit University Identification Number
                  </p>
                </div>
              )}
              
              {/* NIP for faculty */}
              {selectedRole === "dosen" && (
                <div>
                  <label htmlFor="nip" className="block text-sm font-medium mb-1">
                    NIP <span className="text-error">*</span>
                  </label>
                  <Input
                    id="nip"
                    placeholder="198701012015011001"
                    {...register("nip")}
                    error={errors.nip?.message}
                    disabled={isSubmitting}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    18-digit Faculty Identification Number
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Warning for admin/executive accounts */}
          {(selectedRole === "admin" || selectedRole === "executive") && (
            <div className="bg-warning/10 border border-warning/20 rounded-md p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-warning mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-warning">Security Notice</h4>
                <p className="text-sm mt-1 text-muted-foreground">
                  You are creating an account with elevated privileges. {selectedRole === "admin" ? "Admin" : "Executive"} accounts have extensive access to system functions and sensitive data. Please ensure this account is only given to authorized personnel.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-4 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/users")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            Create User
          </Button>
        </div>
      </form>
    </motion.div>
  );
}