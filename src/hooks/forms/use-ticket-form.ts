// src/hooks/forms/use-ticket-form.ts
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateTicket } from "@/hooks/api/tickets";
import { useTicketCategories } from "@/hooks/api/metrics";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Validation schema
const createTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  subcategory: z.string().min(1, "Please select a subcategory"),
  type: z.string().optional(),
  department: z.string().min(1, "Please select a department"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
});

type CreateTicketValues = z.infer<typeof createTicketSchema>;

export function useCreateTicketForm() {
  const router = useRouter();
  const { mutateAsync: createTicket, isPending } = useCreateTicket();
  const { data: categoriesData } = useTicketCategories();
  const [attachments, setAttachments] = useState<File[]>([]);
  
  const form = useForm<CreateTicketValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      subject: "",
      description: "",
      category: "",
      subcategory: "",
      type: "",
      department: "",
      priority: "medium",
    },
  });
  
  const onSubmit = async (values: CreateTicketValues) => {
    try {
      const formData = new FormData();
      
      // Add form fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      
      // Add attachments to FormData
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });
      
      await createTicket(formData);
      
      // Redirect to my tickets page on success
      router.push("/mahasiswa/tickets/my");
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Basic validation
    const validFiles = files.filter((file) => {
      // Check file size (max 5MB)
      const isValidSize = file.size <= 5 * 1024 * 1024;
      
      return isValidSize;
    });
    
    setAttachments((prev) => [...prev, ...validFiles]);
  };
  
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };
  
  // Get subcategories based on selected category
  const subcategories = form.watch("category") 
    ? categoriesData?.[form.watch("category")]?.subcategories || []
    : [];
  
  return {
    form,
    onSubmit,
    isPending,
    attachments,
    handleFileChange,
    removeAttachment,
    subcategories,
  };
}