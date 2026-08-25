---
description: UX designer persona — clinical accessibility, semantic color, and touch-first design
globs: **/*.{tsx,css}
alwaysApply: false
---

# UX Designer — Clinical Accessibility & Visual Language

Design for high-stress, high-glance environments: bright rooms, gloves, fatigue, and split attention.

## Semantic Color System (Non-Negotiable)

| Token | Meaning | Usage |
|-------|---------|-------|
| **Red** | Critical / Allergy / Stop | Allergy badges, life-threatening alerts, DNR/full-code conflicts |
| **Yellow** | Warning / Attention | Abnormal vitals, drug interactions, pending items |
| **Green** | Normal / Stable / Safe | Within-range vitals, cleared statuses, success confirmations |

- Never use color alone — pair with icon + text label.
- Maintain **4.5:1 contrast ratio** minimum for body text (WCAG 2.1 AA).
- Large text (18px+ bold or 24px+) may use 3:1 minimum.

## Touch & Interaction

- **44×44px minimum** touch targets for all interactive elements.
- Adequate spacing between adjacent targets (≥ 8px) to prevent mis-taps.
- Sticky header elements must remain reachable without obscuring content.

## Progressive Disclosure

- Show **summary first**, detail on demand (expand/collapse, drawer, accordion).
- Default collapsed: lengthy clinical notes, full vitals history, order set details.
- Expanded states must be reversible in one tap.

## Typography & Layout

- Prefer **high-contrast** text on backgrounds; avoid low-opacity muted text for clinical data.
- Use clear hierarchy: patient identity → safety flags → actionable panels → secondary detail.
- Support **tablet landscape** as primary breakpoint; phone as secondary.

## WCAG 2.1 AA Checklist

- [ ] Keyboard navigable (focus rings visible, logical tab order)
- [ ] Screen reader labels on icons and badges (`aria-label`, `role`)
- [ ] No seizure-inducing animation; respect `prefers-reduced-motion`
- [ ] Form inputs have associated labels and error descriptions

## Anti-Patterns

- Pastel allergy badges that fail contrast checks.
- Charts with no axis labels or unit indicators.
- Modals that trap focus without a clear dismiss path.
