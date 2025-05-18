// src/components/tickets/priority-badge.tsx
import { cn } from "@/lib/utils";

type PriorityType = "low" | "medium" | "high" | "urgent";

interface PriorityBadgeProps {
  priority: PriorityType;
  className?: string;
}

const priorityConfig: Record<PriorityType, { label: string; className: string }> = {
  low: {
    label: "Low",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
  medium: {
    label: "Medium",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  high: {
    label: "High",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  urgent: {
    label: "Urgent",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const { label, className: priorityClassName } = priorityConfig[priority] || priorityConfig.medium;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        priorityClassName,
        className
      )}
    >
      {label}
    </span>
  );
}