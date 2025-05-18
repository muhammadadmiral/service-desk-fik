// src/hooks/api/tickets.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Get all tickets with filtering
export function useTickets(params?: any) {
  return useQuery({
    queryKey: ["tickets", params],
    queryFn: () => apiClient.tickets.getAll(params).then(res => res.data),
  });
}

// Get ticket by ID
export function useTicketById(id: number) {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => apiClient.tickets.getById(id).then(res => res.data),
    enabled: !!id,
  });
}

// Get current user's tickets
export function useMyTickets() {
  return useQuery({
    queryKey: ["my-tickets"],
    queryFn: () => apiClient.tickets.getMyTickets().then(res => res.data),
  });
}

// Get tickets assigned to current user
export function useAssignedTickets() {
  return useQuery({
    queryKey: ["assigned-tickets"],
    queryFn: () => apiClient.tickets.getAssigned().then(res => res.data),
  });
}

// Create new ticket
export function useCreateTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: FormData) => 
      apiClient.tickets.create(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
      toast({
        title: "Ticket created",
        description: "Your ticket has been submitted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create ticket",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

// Update ticket
export function useUpdateTicket(id: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: any) => 
      apiClient.tickets.update(id, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast({
        title: "Ticket updated",
        description: "The ticket has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update ticket",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

// Create disposisi
export function useDisposisi(ticketId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: any) => 
      apiClient.tickets.disposisi(ticketId, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["disposisi-history", ticketId] });
      toast({
        title: "Ticket forwarded",
        description: "The ticket has been successfully forwarded",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to forward ticket",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

// Get ticket messages
export function useTicketMessages(ticketId: number) {
  return useQuery({
    queryKey: ["ticket-messages", ticketId],
    queryFn: () => apiClient.tickets.getMessages(ticketId).then(res => res.data),
    enabled: !!ticketId,
  });
}

// Add message to ticket
export function useAddTicketMessage(ticketId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: FormData) => 
      apiClient.tickets.addMessage(ticketId, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-messages", ticketId] });
      toast({
        title: "Message sent",
        description: "Your message has been added to the ticket",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

// Dashboard stats
export function useDashboardStats() {
  return useQuery({
    queryKey: ["ticket-stats"],
    queryFn: () => apiClient.tickets.getStats().then(res => res.data),
  });
}