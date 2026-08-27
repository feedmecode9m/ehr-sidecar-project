"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { OrderPriority, OrderSet, OrderSetItem } from "@/lib/fhir/types";

interface SmartOrderSetProps {
  orderSet: OrderSet;
}

function priorityBadgeClass(priority: OrderPriority): string {
  switch (priority) {
    case "stat":
      return "bg-clinical-critical text-white border-transparent";
    case "urgent":
      return "bg-clinical-warning text-clinical-warning-foreground border-transparent";
    case "routine":
      return "bg-muted text-muted-foreground border-transparent";
  }
}

function priorityLabel(priority: OrderPriority): string {
  return priority.toUpperCase();
}

function OrderRow({
  item,
  checked,
  onCheckedChange,
}: {
  item: OrderSetItem;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer gap-3 rounded-md border border-border bg-background/60 px-3 py-3 hover:bg-muted/50 has-focus-visible:ring-2 has-focus-visible:ring-ring">
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        aria-label={`Select order: ${item.name}`}
        className="mt-0.5 size-5 shrink-0"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="text-sm font-medium leading-snug break-words text-foreground">
          {item.name}
        </span>
        <Badge
          className={cn(
            "w-fit shrink-0 text-[11px] font-semibold uppercase",
            priorityBadgeClass(item.priority),
          )}
        >
          {priorityLabel(item.priority)}
        </Badge>
      </div>
    </label>
  );
}

export function SmartOrderSet({ orderSet }: SmartOrderSetProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function toggleOrder(orderId: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(orderId);
      } else {
        next.delete(orderId);
      }
      return next;
    });
    setSuccessMessage(null);
  }

  function handleAddSelected() {
    if (selectedIds.size === 0) {
      setSuccessMessage("Select at least one order to add.");
      return;
    }

    setSuccessMessage(
      `${selectedIds.size} order${selectedIds.size === 1 ? "" : "s"} queued successfully (demo).`,
    );
  }

  return (
    <Card className="shrink-0 overflow-visible bg-card shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold leading-snug">
          {orderSet.name}
        </CardTitle>
        <CardDescription className="leading-relaxed">
          Based on: {orderSet.indication}
        </CardDescription>
        <p className="pt-1 text-xs text-muted-foreground">
          {orderSet.orders.length} orders — scroll the sidecar to review all
        </p>
      </CardHeader>

      <CardContent className="space-y-2 pb-2">
        <div
          role="list"
          aria-label={`${orderSet.name} orders`}
          className="space-y-2"
        >
          {orderSet.orders.map((item) => (
            <OrderRow
              key={item.id}
              item={item}
              checked={selectedIds.has(item.id)}
              onCheckedChange={(checked) => toggleOrder(item.id, checked)}
            />
          ))}
        </div>

        {successMessage && (
          <p
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium",
              successMessage.includes("queued")
                ? "bg-clinical-normal/15 text-clinical-normal-foreground"
                : "bg-clinical-warning/15 text-clinical-warning-foreground",
            )}
            role="status"
            aria-live="polite"
          >
            {successMessage}
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button
          type="button"
          className="min-h-11 w-full"
          onClick={handleAddSelected}
        >
          Add Selected Orders
          {selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
        </Button>
      </CardFooter>
    </Card>
  );
}
