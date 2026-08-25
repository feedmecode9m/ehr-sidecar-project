import type { Config } from "tailwindcss";

/**
 * Tailwind v4 uses CSS-first configuration in app/globals.css (@theme inline).
 * This file documents clinical semantic tokens and touch-target conventions.
 *
 * Usage in components:
 *   bg-clinical-critical  text-clinical-critical-foreground
 *   bg-clinical-warning   text-clinical-warning-foreground
 *   bg-clinical-normal    text-clinical-normal-foreground
 *   min-h-11 min-w-11     — 44px minimum touch target (WCAG / clinical UX)
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          critical: {
            DEFAULT: "var(--clinical-critical)",
            foreground: "var(--clinical-critical-foreground)",
          },
          warning: {
            DEFAULT: "var(--clinical-warning)",
            foreground: "var(--clinical-warning-foreground)",
          },
          normal: {
            DEFAULT: "var(--clinical-normal)",
            foreground: "var(--clinical-normal-foreground)",
          },
        },
      },
    },
  },
};

export default config;
