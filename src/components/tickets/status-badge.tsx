// src/components/tickets/status-badge.tsx
import { cn } from "@/lib/utils";

type StatusType = "pending" | "disposisi" | "in-progress" | "completed" | "cancelled";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  disposisi: {
    label: "Disposisi",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, className: statusClassName } = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        statusClassName,
        className
      )}
    >
      {label}
    </span>
  );
}