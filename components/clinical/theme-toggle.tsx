"use client";

import { Moon, Sun } from "lucide-react";

import { useUiStore, type SidecarTheme } from "@/lib/store/ui-store";
import { cn } from "@/lib/utils";

const themes: { value: SidecarTheme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useUiStore((s) => s.sidecarTheme);
  const setSidecarTheme = useUiStore((s) => s.setSidecarTheme);

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      role="group"
      aria-label="Sidecar appearance"
    >
      {themes.map(({ value, label, icon: Icon }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setSidecarTheme(value)}
            aria-pressed={isActive}
            title={`Switch to ${label.toLowerCase()} mode`}
            className={cn(
              "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              isActive
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-3.5 shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
