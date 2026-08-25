"use client";

import { useMemo, useState } from "react";

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

const INITIAL_VISIBLE_COUNT = 3;

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
    <label className="flex min-h-11 cursor-pointer gap-3 rounded-md border border-border bg-background px-3 py-3 hover:bg-muted/40 has-focus-visible:ring-2 has-focus-visible:ring-ring">
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
  const [showAll, setShowAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const visibleOrders = useMemo(
    () =>
      showAll
        ? orderSet.orders
        : orderSet.orders.slice(0, INITIAL_VISIBLE_COUNT),
    [orderSet.orders, showAll],
  );

  const hiddenCount = orderSet.orders.length - INITIAL_VISIBLE_COUNT;

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
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold leading-snug">
          {orderSet.name}
        </CardTitle>
        <CardDescription className="leading-relaxed">
          Based on: {orderSet.indication}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <div role="list" aria-label={`${orderSet.name} orders`} className="space-y-2">
          {visibleOrders.map((item) => (
            <OrderRow
              key={item.id}
              item={item}
              checked={selectedIds.has(item.id)}
              onCheckedChange={(checked) => toggleOrder(item.id, checked)}
            />
          ))}
        </div>

        {hiddenCount > 0 && (
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full"
            onClick={() => setShowAll((prev) => !prev)}
            aria-expanded={showAll}
            aria-controls="order-set-full-list"
          >
            {showAll
              ? "Show fewer orders"
              : `Show all (${orderSet.orders.length}) orders`}
          </Button>
        )}

        {showAll && hiddenCount > 0 && (
          <p id="order-set-full-list" className="sr-only">
            Showing all {orderSet.orders.length} orders in this set.
          </p>
        )}

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

      <CardFooter className="border-t bg-card pt-4">
        <Button
          type="button"
          className="min-h-11 w-full"
          onClick={handleAddSelected}
        >
          Add Selected Orders
        </Button>
      </CardFooter>
    </Card>
  );
}
