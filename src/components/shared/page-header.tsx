// src/components/shared/page-header.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action && (
          <Button
            href={action.href}
            onClick={action.onClick}
            as="a"
          >
            {action.label}
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}