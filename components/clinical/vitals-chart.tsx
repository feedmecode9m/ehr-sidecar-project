"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { VitalSign, VitalType } from "@/lib/fhir/types";

interface VitalsChartProps {
  vitalType: VitalType;
  data: VitalSign[];
}

const vitalLabels: Record<VitalType, string> = {
  bloodPressure: "Blood Pressure",
  heartRate: "Heart Rate",
  oxygenSaturation: "Oxygen Saturation",
  temperature: "Temperature",
  respiratoryRate: "Respiratory Rate",
};

function parseChartValue(value: string, vitalType: VitalType): number | null {
  if (vitalType === "bloodPressure") {
    const systolic = Number.parseInt(value.split("/")[0] ?? "", 10);
    return Number.isFinite(systolic) ? systolic : null;
  }

  const numeric = Number.parseFloat(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function VitalsChart({ vitalType, data }: VitalsChartProps) {
  const chartData = data
    .filter((vital) => vital.type === vitalType)
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )
    .map((vital) => ({
      id: vital.id,
      time: formatTimestamp(vital.timestamp),
      timestamp: vital.timestamp,
      value: parseChartValue(vital.value, vitalType),
      displayValue: `${vital.value} ${vital.unit}`,
      status: vital.status,
    }))
    .filter((point) => point.value !== null);

  if (chartData.length === 0) {
    return (
      <p
        className="rounded-md border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground"
        role="status"
      >
        No trend data available for {vitalLabels[vitalType]}.
      </p>
    );
  }

  const unit = data.find((vital) => vital.type === vitalType)?.unit ?? "";
  const yLabel =
    vitalType === "bloodPressure" ? `Systolic (${unit})` : unit;

  return (
    <div
      className="h-56 w-full"
      role="img"
      aria-label={`${vitalLabels[vitalType]} trend chart showing ${chartData.length} readings over time`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11 }}
            interval="preserveStartEnd"
            aria-hidden="true"
          />
          <YAxis
            tick={{ fontSize: 11 }}
            unit={vitalType === "bloodPressure" ? undefined : ` ${unit}`}
            aria-hidden="true"
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 11 },
            }}
          />
          <Tooltip
            formatter={(value, _name, item) => {
              const payload = item?.payload as { displayValue?: string } | undefined;
              return [payload?.displayValue ?? value, vitalLabels[vitalType]];
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--clinical-normal)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
