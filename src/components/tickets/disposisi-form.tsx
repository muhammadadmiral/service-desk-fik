// src/components/tickets/disposisi-form.tsx
"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useDisposisi } from "@/hooks/api/tickets";
import { useAvailableDosen } from "@/hooks/api/users";
import { useToast } from "@/hooks/use-toast";

// Validation schema
const disposisiSchema = z.object({
  toUserId: z.number({
    required_error: "Please select a user",
  }),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
  notes: z.string().min(5, "Notes must be at least 5 characters"),
  updateProgress: z.number({
    required_error: "Please enter progress update",
  }).min(0).max(100),
  actionType: z.enum(["forward", "escalate", "return"]),
});

type DisposisiValues = z.infer<typeof disposisiSchema>;

interface DisposisiFormProps {
  ticketId: number;
  onCancel: () => void;
  onSuccess: () => void;
}

export function DisposisiForm({ ticketId, onCancel, onSuccess }: DisposisiFormProps) {
  const { toast } = useToast();
  const { mutateAsync, isPending } = useDisposisi(ticketId);
  const { data: availableDosen, isLoading } = useAvailableDosen();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DisposisiValues>({
    resolver: zodResolver(disposisiSchema),
    defaultValues: {
      reason: "",
      notes: "",
      updateProgress: 30,
      actionType: "forward",
    },
  });
  
  const onSubmit = async (values: DisposisiValues) => {
    try {
      await mutateAsync(values);
      
      toast({
        title: "Ticket forwarded",
        description: "The ticket has been successfully forwarded",
        variant: "success",
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Failed to forward ticket",
        description: "An error occurred while forwarding the ticket",
        variant: "destructive",
      });
    }
  };
  
  // Prepare user options for select
  const userOptions = availableDosen
    ? availableDosen.map((user) => ({
        label: `${user.name} (${user.activeTicketCount} active tickets)`,
        value: user.id.toString(),
      }))
    : [];
  
  // Action type options
  const actionTypeOptions = [
    { label: "Forward", value: "forward" },
    { label: "Escalate", value: "escalate" },
    { label: "Return", value: "return" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Forward Ticket</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="toUserId" className="block text-sm font-medium mb-1">
            Forward To
          </label>
          <Controller
            control={control}
            name="toUserId"
            render={({ field }) => (
              <Select
                options={userOptions}
                value={field.value?.toString() || ""}
                onChange={(value) => field.onChange(parseInt(value))}
                placeholder="Select user"
                error={errors.toUserId?.message}
                disabled={isLoading}
              />
            )}
          />
        </div>
        
        <div>
          <label htmlFor="actionType" className="block text-sm font-medium mb-1">
            Action Type
          </label>
          <Controller
            control={control}
            name="actionType"
            render={({ field }) => (
              <Select
                options={actionTypeOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select action type"
                error={errors.actionType?.message}
              />
            )}
          />
        </div>
        
        <div>
          <label htmlFor="reason" className="block text-sm font-medium mb-1">
            Reason
          </label>
          <Input
            id="reason"
            placeholder="Reason for forwarding"
            {...register("reason")}
            error={errors.reason?.message}
          />
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            className={`w-full rounded-md border ${
              errors.notes ? "border-error" : "border-input"
            } bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50`}
            rows={3}
            placeholder="Additional notes or instructions"
            {...register("notes")}
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-error">{errors.notes.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="updateProgress" className="block text-sm font-medium mb-1">
            Progress Update (%)
          </label>
          <Input
            id="updateProgress"
            type="number"
            min="0"
            max="100"
            {...register("updateProgress", { valueAsNumber: true })}
            error={errors.updateProgress?.message}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
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
          Forward Ticket
        </Button>
      </div>
    </form>
  );
}