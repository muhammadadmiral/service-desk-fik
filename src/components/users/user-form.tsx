// src/components/users/user-form.tsx
"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCreateUser, useUpdateUser } from "@/hooks/api/users";
import { useRouter } from "next/navigation";

// Validation schema
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["mahasiswa", "dosen", "admin", "executive"]),
  department: z.string().optional(),
  position: z.string().optional(),
  nim: z.string().optional(),
  nip: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  userId?: number;
  initialData?: Partial<UserFormValues>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UserForm({ userId, initialData, onSuccess, onCancel }: UserFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = userId ? useUpdateUser(userId) : { mutateAsync: null, isPending: false };
  
  const isEditing = !!userId;
  const isPending = isCreating || isUpdating;
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "", // Don't set password when editing
      role: initialData?.role || "mahasiswa",
      department: initialData?.department || "",
      position: initialData?.position || "",
      nim: initialData?.nim || "",
      nip: initialData?.nip || "",
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
    try {
      if (isEditing && updateUser) {
        // When editing, omit the password if it's empty
        const updateData = { ...values };
        if (!updateData.password) {
          delete updateData.password;
        }
        
        await updateUser(updateData);
        
        toast({
          title: "User updated",
          description: "User has been updated successfully",
          variant: "success",
        });
      } else {
        await createUser(values);
        
        toast({
          title: "User created",
          description: "User has been created successfully",
          variant: "success",
        });
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/users");
        router.refresh();
      }
    } catch (error: any) {
      toast({
        title: `Failed to ${isEditing ? "update" : "create"} user`,
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <Input
            id="name"
            placeholder="John Doe"
            {...register("name")}
            error={errors.name?.message}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <Input
            id="email"
            placeholder="john@example.com"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password {isEditing && "(leave empty to keep current)"}
          </label>
          <Input
            id="password"
            type="password"
            placeholder={isEditing ? "••••••••" : "New password"}
            {...register("password")}
            error={errors.password?.message}
          />
        </div>
        
        <div>
          <label htmlFor="role" className="block text-sm font-medium mb-1">
            Role
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
              />
            )}
          />
        </div>
        
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
                />
              )}
            />
          </div>
        )}
        
        {selectedRole === "mahasiswa" && (
          <div>
            <label htmlFor="nim" className="block text-sm font-medium mb-1">
              NIM
            </label>
            <Input
              id="nim"
              placeholder="e.g. 21105101001"
              {...register("nim")}
              error={errors.nim?.message}
            />
          </div>
        )}
        
        {selectedRole === "dosen" && (
          <div>
            <label htmlFor="nip" className="block text-sm font-medium mb-1">
              NIP
            </label>
            <Input
              id="nip"
              placeholder="e.g. 198701012015011001"
              {...register("nip")}
              error={errors.nip?.message}
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isPending}
        >
          {isEditing ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
}