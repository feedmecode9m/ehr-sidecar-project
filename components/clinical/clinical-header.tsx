"use client";

import { Suspense } from "react";

import { AllergyBadge } from "@/components/clinical/allergy-badge";
import { CodeStatusBadge } from "@/components/clinical/code-status-badge";
import {
  PatientSwitcher,
  type PatientOption,
} from "@/components/clinical/patient-switcher";
import { ThemeToggle } from "@/components/clinical/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import type { Allergy, Patient } from "@/lib/fhir/types";

interface ClinicalHeaderProps {
  patient: Patient;
  allergies: Allergy[];
  patients: PatientOption[];
}

function PatientSwitcherFallback() {
  return (
    <div className="flex flex-wrap gap-1" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-11 w-24 rounded-md" />
      ))}
    </div>
  );
}

export function ClinicalHeader({
  patient,
  allergies,
  patients,
}: ClinicalHeaderProps) {
  const isNKDA = allergies.length === 0;

  return (
    <header className="z-10 shrink-0 border-b border-border bg-card/95 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              EHR Sidecar
            </p>
            <h1 className="text-2xl font-bold leading-tight text-foreground">
              {patient.name}
            </h1>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm font-medium text-foreground">
              <span>
                {patient.age}
                {patient.sex}
              </span>
              <span aria-hidden="true">·</span>
              <span>{patient.mrn}</span>
              <span aria-hidden="true">·</span>
              <span>{patient.location}</span>
            </div>
          </div>
          <ThemeToggle className="shrink-0" />
        </div>

        <Suspense fallback={<PatientSwitcherFallback />}>
          <PatientSwitcher
            patients={patients}
            activePatientId={patient.id}
          />
        </Suspense>

        <div
          className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start"
          aria-label="Patient safety indicators"
        >
          <AllergyBadge allergies={allergies} isNKDA={isNKDA} />
          <CodeStatusBadge status={patient.codeStatus} />
        </div>
      </div>
    </header>
  );
}
