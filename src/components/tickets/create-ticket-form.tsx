// src/components/tickets/create-ticket-form.tsx
"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCreateTicket } from "@/hooks/api/tickets";
import { useTicketCategories } from "@/hooks/api/metrics";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Validation schema
const createTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  subcategory: z.string().min(1, "Please select a subcategory"),
  department: z.string().min(1, "Please select a department"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
});

type CreateTicketValues = z.infer<typeof createTicketSchema>;

export function CreateTicketForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync: createTicket, isPending } = useCreateTicket();
  const { data: categoriesData, isLoading: isLoadingCategories } = useTicketCategories();
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateTicketValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      subject: "",
      description: "",
      category: "",
      subcategory: "",
      department: "",
      priority: "medium",
    },
  });
  
  const selectedCategory = watch("category");
  
  // Update subcategories when category changes
  useEffect(() => {
    if (selectedCategory && categoriesData) {
      setValue("subcategory", "");
    }
  }, [selectedCategory, categoriesData, setValue]);
  
  // Handle file input
  const [attachments, setAttachments] = useState<File[]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    
    if (!fileList) return;
    
    const filesArray = Array.from(fileList);
    const validFiles: File[] = [];
    
    filesArray.forEach((file) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 5MB limit`,
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an accepted file type`,
          variant: "destructive",
        });
        return;
      }
      
      validFiles.push(file);
    });
    
    // Add valid files to state
    setAttachments((prev) => [...prev, ...validFiles]);
    
    // Reset file input
    e.target.value = "";
  };
  
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };
  
  // Process form submission
  const onSubmit = async (values: CreateTicketValues) => {
    try {
      const formData = new FormData();
      
      // Add form values to FormData
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Add attachments to FormData
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });
      
      await createTicket(formData);
      
      toast({
        title: "Ticket created successfully",
        description: "Your ticket has been submitted",
        variant: "success",
      });
      
      // Redirect to my tickets page
      router.push("/mahasiswa/tickets/my");
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Failed to create ticket",
        description: "An error occurred while creating your ticket",
        variant: "destructive",
      });
    }
  };
  
  // Prepare options for select inputs
  const categoryOptions = categoriesData
    ? Object.keys(categoriesData).map((category) => ({
        label: categoriesData[category].name || category,
        value: category,
      }))
    : [];
  
  const subcategoryOptions = selectedCategory && categoriesData?.[selectedCategory]
    ? categoriesData[selectedCategory].subcategories.map((subcategory) => ({
        label: subcategory,
        value: subcategory,
      }))
    : [];
  
  const departmentOptions = [
    { label: "Informatika", value: "Informatika" },
    { label: "Sistem Informasi", value: "Sistem Informasi" },
    { label: "Fasilitas", value: "Fasilitas" },
    { label: "Keuangan", value: "Keuangan" },
    { label: "Akademik", value: "Akademik" },
  ];
  
  const priorityOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Urgent", value: "urgent" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium">
              Subject
            </label>
            <Input
              id="subject"
              placeholder="Brief description of your issue"
              {...register("subject")}
              error={errors.subject?.message}
              className="mt-1"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Please provide details about your issue"
              className={`mt-1 block w-full rounded-md border ${
                errors.description ? "border-error" : "border-input"
              } bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50`}
              {...register("description")}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-error">{errors.description.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="category" className="block text-sm font-medium">
                Category
              </label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    options={categoryOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select category"
                    error={errors.category?.message}
                    disabled={isLoadingCategories}
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium">
                Subcategory
              </label>
              <Controller
                control={control}
                name="subcategory"
                render={({ field }) => (
                  <Select
                    options={subcategoryOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select subcategory"
                    error={errors.subcategory?.message}
                    disabled={!selectedCategory || isLoadingCategories}
                  />
                )}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="department" className="block text-sm font-medium">
                Department
              </label>
              <Controller
                control={control}
                name="department"
                render={({ field }) => (
                  <Select
                    options={departmentOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select department"
                    error={errors.department?.message}
                  />
                )}
              />
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium">
                Priority
              </label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select
                    options={priorityOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select priority"
                    error={errors.priority?.message}
                  />
                )}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium">
              Attachments <span className="text-muted-foreground">(Optional, max 5MB each)</span>
            </label>
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-input px-6 py-4">
              <div className="text-center">
                <div className="mt-1 flex text-sm text-muted-foreground">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={handleFileChange}
                      accept={ACCEPTED_FILE_TYPES.join(",")}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  PDF, Word, PNG, JPG up to 5MB
                </p>
              </div>
            </div>
          </div>
          
          {/* File preview list */}
          {attachments.length > 0 && (
            <div className="mt-2">
              <h4 className="font-medium text-sm">Attached Files:</h4>
              <ul className="mt-2 space-y-2">
                {attachments.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between rounded-md bg-muted p-2 text-sm"
                  >
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">
                        {file.type.includes("image") ? "📷" : "📄"}
                      </span>
                      <span className="truncate max-w-[250px]">{file.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="ml-2 text-muted-foreground hover:text-error transition-colors"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            Submit Ticket
          </Button>
        </div>
      </form>
    </motion.div>
  );
}