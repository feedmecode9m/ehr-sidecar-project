import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SidecarTheme = "light" | "dark";

/**
 * UI-only client state. Patient selection uses URL search params (?patient=ID)
 * per HealthTech Security guidelines — not stored here.
 */
interface UiState {
  vitalsExpanded: boolean;
  setVitalsExpanded: (expanded: boolean) => void;
  sidecarTheme: SidecarTheme;
  setSidecarTheme: (theme: SidecarTheme) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      vitalsExpanded: false,
      setVitalsExpanded: (expanded) => set({ vitalsExpanded: expanded }),
      sidecarTheme: "dark",
      setSidecarTheme: (theme) => set({ sidecarTheme: theme }),
    }),
    {
      name: "ehr-sidecar-ui",
      partialize: (state) => ({ sidecarTheme: state.sidecarTheme }),
    },
  ),
);
