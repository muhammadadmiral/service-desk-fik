// src/components/tickets/ticket-detail.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow, format } from "date-fns";
import { StatusBadge } from "./status-badge";
import { PriorityBadge } from "./priority-badge";
import { Button } from "@/components/ui/button";
import { useTicketById, useTicketMessages, useUpdateTicket } from "@/hooks/api/tickets";
import { MessageForm } from "./message-form";
import { DisposisiForm } from "./disposisi-form";

interface TicketDetailProps {
  ticketId: number;
  canDisposisi?: boolean;
  canUpdate?: boolean;
}

export function TicketDetail({ ticketId, canDisposisi = false, canUpdate = false }: TicketDetailProps) {
  const { data: ticket, isLoading, isError } = useTicketById(ticketId);
  const { data: messages } = useTicketMessages(ticketId);
  const { mutate: updateTicket, isPending: isUpdating } = useUpdateTicket(ticketId);
  
  const [showDisposisiForm, setShowDisposisiForm] = useState(false);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded-md w-1/3"></div>
        <div className="h-4 bg-muted rounded-md w-1/4"></div>
        <div className="h-32 bg-muted rounded-md"></div>
        <div className="h-8 bg-muted rounded-md w-1/2"></div>
        <div className="h-64 bg-muted rounded-md"></div>
      </div>
    );
  }
  
  // Error state
  if (isError || !ticket) {
    return (
      <div className="p-6 bg-muted rounded-lg text-center">
        <h3 className="text-lg font-medium mb-2">Failed to load ticket</h3>
        <p className="text-muted-foreground mb-4">
          An error occurred while loading the ticket details.
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }
  
  // Handle status update
  const handleStatusUpdate = (status: string) => {
    updateTicket({
      status,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Ticket Header */}
      <div className="bg-background rounded-lg border border-border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">{ticket.subject}</h1>
              <span className="text-sm text-muted-foreground">
                {ticket.ticketNumber}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {ticket.category}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canDisposisi && (
              <Button
                onClick={() => setShowDisposisiForm(true)}
                disabled={ticket.status === "completed" || ticket.status === "cancelled"}
              >
                Forward Ticket
              </Button>
            )}
            {canUpdate && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate("in-progress")}
                  disabled={ticket.status === "in-progress" || isUpdating}
                >
                  Start Working
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleStatusUpdate("completed")}
                  disabled={ticket.status === "completed" || isUpdating}
                >
                  Mark Complete
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Ticket Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
            <p className="mt-1">
              {format(new Date(ticket.createdAt), "PPpp")}
              {" "}
              <span className="text-muted-foreground">
                ({formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })})
              </span>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
            <p className="mt-1">{ticket.department || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Current Handler</h3>
            <p className="mt-1">{ticket.currentHandler ? "Assigned" : "Unassigned"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">SLA Status</h3>
            <p className="mt-1 flex items-center">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  ticket.slaStatus === "on-time"
                    ? "bg-success"
                    : ticket.slaStatus === "at-risk"
                    ? "bg-warning"
                    : "bg-error"
                }`}
              ></span>
              {ticket.slaStatus === "on-time"
                ? "On Time"
                : ticket.slaStatus === "at-risk"
                ? "At Risk"
                : "Breached"}
              {ticket.slaDeadline && (
                <span className="ml-2 text-muted-foreground">
                  (Due: {format(new Date(ticket.slaDeadline), "PPp")})
                </span>
              )}
            </p>
          </div>
        </div>
        
        {/* Description */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
          <div className="mt-2 p-4 bg-muted rounded-md whitespace-pre-wrap">
            {ticket.description}
          </div>
        </div>
        
        {/* Attachments */}
        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted-foreground">Attachments</h3>
            <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {ticket.attachments.map((attachment: any, index: number) => (
                <li
                  key={index}
                  className="flex items-center p-2 bg-muted rounded-md text-sm"
                >
                  <span className="mr-2">
                    {attachment.fileType?.includes("image") ? "📷" : "📄"}
                  </span>
                  
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {attachment.fileName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Disposisi Form */}
      {showDisposisiForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background rounded-lg border border-border p-6"
        >
          <DisposisiForm
            ticketId={ticketId}
            onCancel={() => setShowDisposisiForm(false)}
            onSuccess={() => setShowDisposisiForm(false)}
          />
        </motion.div>
      )}
      
      {/* Messages */}
      <div className="bg-background rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>
        
        {messages && messages.length > 0 ? (
          <div className="space-y-6">
            {messages.map((message: any) => (
              <div
                key={message.id}
                className="p-4 bg-muted rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                        {message.sender.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{message.sender.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.sender.role} • {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(message.createdAt), "PPp")}
                  </div>
                </div>
                <div className="mt-2 text-sm whitespace-pre-wrap">
                  {message.message}
                </div>
                
                {/* Message attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">
                      Attachments
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {message.attachments.map((attachment: any, index: number) => (
                        <li
                          key={index}
                          className="flex items-center p-2 bg-background rounded-md text-xs"
                        >
                          <span className="mr-2">
                            {attachment.fileType?.includes("image") ? "📷" : "📄"}
                          </span>
                          
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate"
                          >
                            {attachment.fileName}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-muted/50 rounded-lg text-center">
            <p className="text-muted-foreground">
              No messages yet. Be the first to reply to this ticket.
            </p>
          </div>
        )}
        
        {/* Add message form */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Add a Response</h3>
          <MessageForm ticketId={ticketId} />
        </div>
      </div>
    </motion.div>
  );
}