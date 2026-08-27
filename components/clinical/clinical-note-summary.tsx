"use client";

import { AlertTriangle, Sparkles } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { EmptyState } from "@/components/clinical/empty-state";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ClinicalSummary } from "@/lib/fhir/summarize-note";
import {
  extractCriticalAlerts,
  segmentCriticalKeywords,
} from "@/lib/utils/extract-critical-alerts";

interface ClinicalNoteSummaryProps {
  noteId: string;
  hasNote: boolean;
}

type SummaryState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: ClinicalSummary }
  | { status: "error" };

function highlightKeywords(text: string): ReactNode {
  const segments = segmentCriticalKeywords(text);

  return segments.map((segment, index) =>
    segment.highlight ? (
      <span
        key={`${segment.text}-${index}`}
        className="font-bold text-clinical-critical"
      >
        {segment.text}
      </span>
    ) : (
      <span key={`${segment.text}-${index}`}>{segment.text}</span>
    ),
  );
}

export function ClinicalNoteSummary({
  noteId,
  hasNote,
}: ClinicalNoteSummaryProps) {
  const [state, setState] = useState<SummaryState>({ status: "idle" });

  const criticalAlerts = useMemo(() => {
    if (state.status !== "success") return [];
    return extractCriticalAlerts(
      state.data.summary,
      state.data.keyFindings,
      state.data.actionItems,
    );
  }, [state]);

  async function generateSummary() {
    setState({ status: "loading" });

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId }),
      });

      if (!response.ok) {
        setState({ status: "error" });
        return;
      }

      const data = (await response.json()) as ClinicalSummary;
      setState({ status: "success", data });
    } catch {
      setState({ status: "error" });
    }
  }

  if (!hasNote) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No clinical note available"
        description="An AI summary can be generated once a progress note is documented in the chart."
      />
    );
  }

  return (
    <Card className="shrink-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          AI Clinical Summary
        </CardTitle>
        <CardDescription>
          Generate a structured summary from the chart note (demo)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {state.status === "idle" && (
          <Button
            type="button"
            className="min-h-11 w-full"
            onClick={generateSummary}
          >
            <Sparkles className="size-4" aria-hidden="true" />
            Generate AI Summary
          </Button>
        )}

        {state.status === "loading" && (
          <div
            className="space-y-3"
            aria-busy="true"
            aria-label="Generating summary"
          >
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-24 w-full rounded-md" />
          </div>
        )}

        {state.status === "error" && (
          <div className="space-y-3">
            <p
              className="rounded-md bg-clinical-critical/10 px-3 py-2 text-sm font-medium text-clinical-critical-foreground"
              role="alert"
            >
              Failed to generate summary. Please try again.
            </p>
            <Button
              type="button"
              variant="outline"
              className="min-h-11 w-full"
              onClick={generateSummary}
            >
              Retry
            </Button>
          </div>
        )}

        {state.status === "success" && (
          <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
            {criticalAlerts.length > 0 && (
              <div
                className="rounded-md border border-clinical-critical/40 bg-clinical-critical px-3 py-3 text-white shadow-sm"
                role="alert"
                aria-label="Critical care notes"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className="size-5 shrink-0"
                    aria-hidden="true"
                  />
                  <h3 className="text-sm font-bold uppercase tracking-wide">
                    Critical Care Notes
                  </h3>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-medium leading-snug">
                  {criticalAlerts.map((alert) => (
                    <li key={alert}>{alert}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Summary
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-foreground">
                {highlightKeywords(state.data.summary)}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Key Findings
              </h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-foreground">
                {state.data.keyFindings.map((finding) => (
                  <li key={finding}>{highlightKeywords(finding)}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Action Items
              </h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-foreground">
                {state.data.actionItems.map((item) => (
                  <li key={item}>{highlightKeywords(item)}</li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-muted-foreground">
              Generated{" "}
              {new Date(state.data.generatedAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
