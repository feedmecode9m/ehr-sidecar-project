import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-lg border border-dashed border-border bg-white px-4 py-8 text-center",
        className,
      )}
      role="status"
    >
      <div
        className="mb-3 flex size-12 items-center justify-center rounded-full bg-slate-100"
        aria-hidden="true"
      >
        <Icon className="size-6 text-slate-500" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-xs text-sm leading-relaxed text-slate-500">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          type="button"
          variant="outline"
          className="mt-4 min-h-11"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
