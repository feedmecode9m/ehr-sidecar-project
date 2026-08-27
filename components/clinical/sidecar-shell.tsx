"use client";

import type { ReactNode } from "react";

import { useUiStore } from "@/lib/store/ui-store";
import { cn } from "@/lib/utils";

interface SidecarShellProps {
  children: ReactNode;
}

export function SidecarShell({ children }: SidecarShellProps) {
  const theme = useUiStore((s) => s.sidecarTheme);

  return (
    <aside
      data-theme={theme}
      className={cn(
        "flex h-dvh min-h-0 w-full flex-col overflow-hidden border-l border-border bg-background text-foreground md:h-screen md:w-[min(100%,480px)] md:max-w-[480px] lg:max-w-[520px]",
      )}
    >
      {children}
    </aside>
  );
}
