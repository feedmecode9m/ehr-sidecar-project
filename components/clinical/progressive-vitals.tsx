"use client";

import dynamic from "next/dynamic";
import { Activity, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/clinical/empty-state";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LatestVitals, VitalSign, VitalStatus, VitalType } from "@/lib/fhir/types";

const VitalsChart = dynamic(
  () =>
    import("@/components/clinical/vitals-chart").then((mod) => ({
      default: mod.VitalsChart,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-56 w-full rounded-md" />,
  },
);

interface ProgressiveVitalsProps {
  latestVitals: LatestVitals;
  vitalsHistory: VitalSign[];
}

interface VitalDisplayConfig {
  type: VitalType;
  label: string;
  vital?: VitalSign;
}

const vitalConfigs: Omit<VitalDisplayConfig, "vital">[] = [
  { type: "bloodPressure", label: "BP" },
  { type: "heartRate", label: "HR" },
  { type: "oxygenSaturation", label: "SpO₂" },
  { type: "temperature", label: "Temp" },
  { type: "respiratoryRate", label: "RR" },
];

function statusDotClass(status: VitalStatus | undefined): string {
  switch (status) {
    case "critical":
      return "bg-clinical-critical";
    case "warning":
      return "bg-clinical-warning";
    case "normal":
      return "bg-clinical-normal";
    default:
      return "bg-muted-foreground/40";
  }
}

function statusLabel(status: VitalStatus | undefined): string {
  switch (status) {
    case "critical":
      return "critical";
    case "warning":
      return "warning";
    case "normal":
      return "normal";
    default:
      return "unknown";
  }
}

export function ProgressiveVitals({
  latestVitals,
  vitalsHistory,
}: ProgressiveVitalsProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedType, setSelectedType] = useState<VitalType>("bloodPressure");

  const displayVitals: VitalDisplayConfig[] = useMemo(
    () =>
      vitalConfigs.map((config) => ({
        ...config,
        vital: latestVitals[config.type],
      })),
    [latestVitals],
  );

  const chartableTypes = useMemo(
    () =>
      vitalConfigs
        .map((config) => config.type)
        .filter((type) =>
          vitalsHistory.some((vital) => vital.type === type),
        ),
    [vitalsHistory],
  );

  const effectiveSelectedType = chartableTypes.includes(selectedType)
    ? selectedType
    : (chartableTypes[0] ?? "bloodPressure");

  const hasAnyVitals =
    vitalsHistory.length > 0 ||
    vitalConfigs.some((config) => latestVitals[config.type] !== undefined);

  if (!hasAnyVitals) {
    return (
      <EmptyState
        icon={Activity}
        title="No vitals recorded"
        description="Vital signs will appear here once they are charted for this patient."
      />
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <CardTitle className="text-base font-semibold">Vitals</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-11 shrink-0"
          aria-expanded={expanded}
          aria-controls="vitals-chart-panel"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? (
            <>
              <ChevronUp className="size-4" aria-hidden="true" />
              <span>Collapse</span>
            </>
          ) : (
            <>
              <ChevronDown className="size-4" aria-hidden="true" />
              <span>Expand trends</span>
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          aria-label="Latest vital signs"
        >
          {displayVitals.map(({ type, label, vital }) => (
            <div
              key={type}
              className="flex items-start gap-2 rounded-md border border-border bg-muted/20 p-2"
            >
              <span
                className={cn(
                  "mt-1.5 size-2.5 shrink-0 rounded-full",
                  statusDotClass(vital?.status),
                )}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  {label}
                  <span className="sr-only">
                    , status {statusLabel(vital?.status)}
                  </span>
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {vital ? (
                    <>
                      {vital.value}
                      <span className="ml-0.5 text-xs font-normal text-muted-foreground">
                        {vital.unit}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {expanded && (
          <div id="vitals-chart-panel" className="space-y-3 border-t pt-4">
            {chartableTypes.length > 0 ? (
              <>
                <div
                  role="tablist"
                  aria-label="Select vital sign trend"
                  className="flex flex-wrap gap-2"
                >
                  {chartableTypes.map((type) => {
                    const config = vitalConfigs.find((c) => c.type === type);
                    const isSelected = effectiveSelectedType === type;

                    return (
                      <button
                        key={type}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        aria-controls="vitals-chart-panel"
                        tabIndex={isSelected ? 0 : -1}
                        className={cn(
                          "min-h-11 rounded-md border px-3 text-sm font-medium transition-colors",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background hover:bg-muted",
                        )}
                        onClick={() => setSelectedType(type)}
                      >
                        {config?.label ?? type}
                      </button>
                    );
                  })}
                </div>
                <VitalsChart
                  vitalType={effectiveSelectedType}
                  data={vitalsHistory}
                />
              </>
            ) : (
              <p className="text-sm text-muted-foreground" role="status">
                No vitals history available to chart.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
