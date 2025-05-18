// src/hooks/use-toast.ts
import { toast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
};

export const useToast = () => {
  const showToast = ({ title, description, variant = "default" }: ToastProps) => {
    switch (variant) {
      case "destructive":
        toast.error(title, {
          description,
        });
        break;
      case "success":
        toast.success(title, {
          description,
        });
        break;
      default:
        toast(title, {
          description,
        });
    }
  };

  return { toast: showToast };
};