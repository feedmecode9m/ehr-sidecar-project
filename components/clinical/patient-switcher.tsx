"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

export interface PatientOption {
  id: string;
  name: string;
}

interface PatientSwitcherProps {
  patients: PatientOption[];
  activePatientId: string;
  className?: string;
}

export function PatientSwitcher({
  patients,
  activePatientId,
  className,
}: PatientSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function selectPatient(patientId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("patient", patientId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div
      role="radiogroup"
      aria-label="Select patient"
      className={cn("flex flex-wrap gap-1", className)}
    >
      {patients.map((patient) => {
        const isActive = patient.id === activePatientId;

        return (
          <button
            key={patient.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => selectPatient(patient.id)}
            className={cn(
              "min-h-11 rounded-md border px-2.5 text-left text-xs font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              isActive
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-background text-foreground hover:bg-muted",
            )}
          >
            <span className="block truncate font-semibold">{patient.name}</span>
            <span
              className={cn(
                "block truncate text-[10px]",
                isActive ? "text-primary-foreground/80" : "text-muted-foreground",
              )}
            >
              {patient.id}
            </span>
          </button>
        );
      })}
    </div>
  );
}
