import { HeartPulse, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CodeStatus } from "@/lib/fhir/types";

interface CodeStatusBadgeProps {
  status: CodeStatus | string;
  className?: string;
}

function normalizeStatus(status: string): CodeStatus | "unknown" {
  const normalized = status.trim().toLowerCase();
  if (normalized === "full code") return "Full Code";
  if (normalized === "dnr" || normalized === "do not resuscitate") return "DNR";
  if (normalized === "limited") return "Limited";
  return "unknown";
}

export function CodeStatusBadge({ status, className }: CodeStatusBadgeProps) {
  const codeStatus = normalizeStatus(status);

  if (codeStatus === "Full Code") {
    return (
      <Badge
        className={cn(
          "min-h-11 gap-2 rounded-md px-3 py-2 text-sm font-semibold",
          "bg-clinical-normal text-white border-clinical-normal-foreground/20",
          className,
        )}
        aria-label="Code status: Full Code"
      >
        <HeartPulse className="size-4 shrink-0" aria-hidden="true" />
        <span>Full Code</span>
      </Badge>
    );
  }

  if (codeStatus === "DNR") {
    return (
      <Badge
        className={cn(
          "min-h-11 gap-2 rounded-md px-3 py-2 text-sm font-semibold",
          "bg-clinical-critical text-white border-clinical-critical-foreground/20",
          className,
        )}
        aria-label="Code status: Do Not Resuscitate"
      >
        <ShieldAlert className="size-4 shrink-0" aria-hidden="true" />
        <span>DNR</span>
      </Badge>
    );
  }

  if (codeStatus === "Limited") {
    return (
      <Badge
        className={cn(
          "min-h-11 gap-2 rounded-md px-3 py-2 text-sm font-semibold",
          "bg-clinical-warning text-clinical-warning-foreground border-clinical-warning-foreground/20",
          className,
        )}
        aria-label="Code status: Limited"
      >
        <ShieldAlert className="size-4 shrink-0" aria-hidden="true" />
        <span>Limited Code</span>
      </Badge>
    );
  }

  return (
    <Badge
      className={cn(
        "min-h-11 gap-2 rounded-md px-3 py-2 text-sm font-semibold",
        className,
      )}
      variant="outline"
      aria-label={`Code status: ${status}`}
    >
      <ShieldAlert className="size-4 shrink-0" aria-hidden="true" />
      <span>{status}</span>
    </Badge>
  );
}
