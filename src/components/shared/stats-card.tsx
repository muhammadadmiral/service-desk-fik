// src/components/shared/stats-card.tsx
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "p-6 bg-background rounded-lg border border-border shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          )}
          {trend && (
            <div className="mt-2 flex items-center text-sm">
              <span
                className={cn(
                  "mr-1 font-medium",
                  trend.value > 0
                    ? "text-success"
                    : trend.value < 0
                    ? "text-error"
                    : "text-muted-foreground"
                )}
              >
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-muted-foreground">
                {trend.label}
              </span>
            </div>
          )}
        </div>
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}