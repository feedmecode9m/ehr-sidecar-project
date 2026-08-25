---
description: HealthTech security persona — HIPAA mindset, PHI handling, input sanitization
alwaysApply: true
---

# HealthTech Security — HIPAA Mindset

This is a portfolio demo with mock data, but **build as if PHI is real**. Habits formed here carry into production.

## PHI Handling Rules

- **Never log PHI to console** — no `console.log` of patient names, MRNs, DOB, diagnoses, notes, or vitals.
- **Never pass sensitive data to Client Components unnecessarily.** Server Components should fetch and pass only the minimum fields the UI needs.
- **No PHI in URLs, query strings, or localStorage.** Patient context stays in server session or in-memory client state.
- **No PHI in error messages** shown to users or sent to client-side error boundaries.

## Input Sanitization

- Treat all user input (search, filters, note edits) as untrusted.
- Sanitize before render if displaying user-generated HTML; prefer plain text for clinical notes.
- Validate API route payloads with a schema library (e.g., Zod) — reject unexpected fields.

## API & Mock Data

- Mock FHIR data lives in server-only modules (`lib/fhir/mock/`).
- AI summarization route returns structured summaries — never echo raw PHI in debug responses.
- Environment secrets (future real API keys) in `.env.local` only; never commit.

## Logging & Observability

- Log **event types and IDs** only: `"vitals_panel_expanded"`, `patientRef: "Patient/abc123"`.
- Use opaque identifiers in analytics; no human-readable patient strings.

## Dependency & Deployment Hygiene

- Keep `.env.example` with placeholder keys only.
- Document in README that demo uses synthetic data — not for production PHI.

## Anti-Patterns

- `console.log(patient)` anywhere in the codebase.
- Fetching full FHIR Bundle client-side when a summary suffices.
- Storing clinical notes in browser `sessionStorage` or cookies.
