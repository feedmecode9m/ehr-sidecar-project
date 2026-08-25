import { AlertCircle, AlertTriangle, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Allergy, AllergySeverity } from "@/lib/fhir/types";

interface AllergyBadgeProps {
  allergies?: Allergy[];
  isNKDA?: boolean;
  className?: string;
}

const severityRank: Record<AllergySeverity, number> = {
  "life-threatening": 3,
  severe: 2,
  moderate: 1,
};

/** Display deduped allergies — prefer verified entries and highest severity. */
function dedupeAllergiesForDisplay(allergies: Allergy[]): Allergy[] {
  const bySubstance = new Map<string, Allergy>();

  for (const allergy of allergies) {
    const key = allergy.substance.trim().toLowerCase();
    const existing = bySubstance.get(key);

    if (!existing) {
      bySubstance.set(key, allergy);
      continue;
    }

    const shouldReplace =
      severityRank[allergy.severity] > severityRank[existing.severity] ||
      (allergy.verified && !existing.verified);

    if (shouldReplace) {
      bySubstance.set(key, allergy);
    }
  }

  return Array.from(bySubstance.values());
}

function severityStyles(severity: AllergySeverity): string {
  if (severity === "life-threatening" || severity === "severe") {
    return "bg-clinical-critical text-white border-clinical-critical-foreground/20";
  }
  return "bg-clinical-warning text-clinical-warning-foreground border-clinical-warning-foreground/20";
}

function SeverityIcon({ severity }: { severity: AllergySeverity }) {
  if (severity === "life-threatening" || severity === "severe") {
    return <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />;
  }
  return <AlertCircle className="size-4 shrink-0" aria-hidden="true" />;
}

export function AllergyBadge({
  allergies = [],
  isNKDA = false,
  className,
}: AllergyBadgeProps) {
  if (isNKDA || allergies.length === 0) {
    return (
      <Badge
        className={cn(
          "min-h-11 gap-2 rounded-md px-3 py-2 text-sm font-semibold",
          "bg-clinical-normal text-white border-clinical-normal-foreground/20",
          className,
        )}
        aria-label="No known drug allergies"
      >
        <Check className="size-4 shrink-0" aria-hidden="true" />
        <span>No Known Drug Allergies</span>
      </Badge>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="list">
      {dedupeAllergiesForDisplay(allergies).map((allergy) => (
        <Badge
          key={allergy.id}
          role="listitem"
          className={cn(
            "min-h-11 gap-2 rounded-md px-3 py-2 text-sm font-semibold",
            severityStyles(allergy.severity),
          )}
          aria-label={`${allergy.substance} allergy, ${allergy.severity} severity. Reaction: ${allergy.reaction}`}
        >
          <SeverityIcon severity={allergy.severity} />
          <span>
            {allergy.substance}
            <span className="sr-only"> — {allergy.severity}</span>
          </span>
        </Badge>
      ))}
    </div>
  );
}
