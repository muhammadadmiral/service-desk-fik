// src/components/tickets/message-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useAddTicketMessage } from "@/hooks/api/tickets";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Validation schema
const messageSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

type MessageValues = z.infer<typeof messageSchema>;

export function MessageForm({ ticketId }: { ticketId: number }) {
  const { toast } = useToast();
  const { mutateAsync, isPending } = useAddTicketMessage(ticketId);
  const [attachments, setAttachments] = useState<File[]>([]);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });
  
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
  
  const onSubmit = async (values: MessageValues) => {
    try {
      const formData = new FormData();
      formData.append("message", values.message);
      
      // Add attachments
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });
      
      await mutateAsync(formData);
      
      // Reset form
      reset();
      setAttachments([]);
      
      toast({
        title: "Message sent",
        description: "Your message has been added to the ticket",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "An error occurred while sending your message",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <textarea
          className={`w-full rounded-md border ${
            errors.message ? "border-error" : "border-input"
          } bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50`}
          rows={4}
          placeholder="Type your message here..."
          {...register("message")}
          disabled={isPending}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-error">{errors.message.message}</p>
        )}
      </div>
      
      {/* File upload */}
      <div className="flex items-center space-x-2">
        <label
          htmlFor="message-attachment"
          className="cursor-pointer rounded-md bg-muted px-3 py-1.5 text-sm font-medium hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Attach Files
          <input
            id="message-attachment"
            type="file"
            multiple
            className="sr-only"
            onChange={handleFileChange}
            disabled={isPending}
          />
        </label>
        <span className="text-xs text-muted-foreground">
          Max 5MB per file
        </span>
      </div>
      
      {/* Display selected files */}
      {attachments.length > 0 && (
        <div className="mt-2">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">
            Selected Files ({attachments.length})
          </h4>
          <ul className="space-y-1">
            {attachments.map((file, index) => (
              <li key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <span className="mr-2">
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
                  className="text-muted-foreground hover:text-error transition-colors"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending}>
          Send Message
        </Button>
      </div>
    </form>
  );
}