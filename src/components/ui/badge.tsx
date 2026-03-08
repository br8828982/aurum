// src/components/ui/badge.tsx
import { cn, getStatusColor } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "status" | "gold" | "outline";
  status?: string;
  className?: string;
}

export function Badge({ children, variant = "default", status, className }: BadgeProps) {
  if (variant === "status" && status) {
    return (
      <span className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium border rounded-sm",
        getStatusColor(status),
        className
      )}>
        {children}
      </span>
    );
  }

  const variants = {
    default: "bg-stone-100 text-stone-700",
    gold: "bg-amber-50 text-amber-700 border border-amber-200",
    outline: "border border-stone-300 text-stone-600",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-sm",
      variants[variant as keyof typeof variants] ?? variants.default,
      className
    )}>
      {children}
    </span>
  );
}
