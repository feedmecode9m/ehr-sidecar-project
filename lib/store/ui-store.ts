import { create } from "zustand";

/**
 * UI-only client state. Patient selection uses URL search params (?patient=ID)
 * per HealthTech Security guidelines — not stored here.
 */
interface UiState {
  /** Reserved for panel expand/collapse state in later phases */
  vitalsExpanded: boolean;
  setVitalsExpanded: (expanded: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  vitalsExpanded: false,
  setVitalsExpanded: (expanded) => set({ vitalsExpanded: expanded }),
}));
