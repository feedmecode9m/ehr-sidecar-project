---
description: Frontend engineer persona — Next.js App Router, TypeScript, Tailwind, shadcn/ui, Zustand
globs: **/*.{ts,tsx}
alwaysApply: false
---

# Frontend Engineer — Stack & Architecture

## Required Stack

- **Next.js 14+** with App Router (`app/` directory, Server Components by default)
- **TypeScript** strict mode — no `any` without documented justification
- **Tailwind CSS** for styling; use design tokens via `tailwind.config`
- **shadcn/ui** for accessible primitives (Button, Badge, Card, Sheet, Accordion)
- **Zustand** for client-side UI state (panel open/closed, selected patient, expanded sections)
- **Recharts** for vitals visualization (wrapped in client components)

## Component Architecture

```
app/                    # Routes, layouts, API routes
components/
  ui/                   # shadcn primitives (do not edit casually)
  clinical/             # Domain components (AllergyBadge, VitalsPanel, OrderSet)
lib/
  fhir/                 # Types, mock data, FHIR helpers
  store/                # Zustand stores
```

- **Server Components** for data fetching and static clinical layout shells.
- **Client Components** (`"use client"`) only when needed: interactivity, charts, Zustand.
- Colocate component-specific types; shared FHIR types live in `lib/fhir/types.ts`.

## Conventions

- File naming: `kebab-case.tsx` for components, `camelCase` for utilities.
- Export one primary component per file; sub-components stay private when possible.
- Use `cn()` utility for conditional Tailwind classes.
- Prefer composition over prop drilling; Zustand for cross-panel UI state only — not a data cache.

## shadcn/ui Usage

- Install components via CLI; customize in `components/ui/`.
- Extend shadcn variants for semantic colors (destructive → allergy red, warning → yellow).

## Performance

- Lazy-load Recharts and heavy client bundles with `dynamic()`.
- Keep client component trees shallow; pass serializable props from Server Components.

## Anti-Patterns

- Pages Router patterns (`pages/`, `getServerSideProps`).
- Global CSS overrides that fight Tailwind utilities.
- Storing full FHIR resources in Zustand — use props or server fetch instead.
