# Resume & Portfolio — EHR Sidecar Project

**Miles Bates** · Los Angeles, CA · miles.steven.bates@gmail.com · 470-738-7221

Use this document to update your resume, LinkedIn, and portfolio. Copy sections directly into Word/Google Docs.

---

## Links (paste into resume header or project line)

| Label | URL |
|-------|-----|
| **GitHub** | https://github.com/feedmecode9m/ehr-sidecar-project |
| **Live Demo** | _Deploy to Vercel — see bottom of this doc_ |
| **Screenshot** | Already in repo: `docs/screenshots/ehr-sidecar-demo.png` |

**One-line project header (resume format):**

```
EHR Sidecar & Clinical Workflow Optimizer | [Live Demo] | https://github.com/feedmecode9m/ehr-sidecar-project
```

---

## Updated Summary (HealthTech-forward — pick one)

**Option A — Software engineer pivot (recommended for HealthTech roles):**

> Full-stack software engineer with production experience in Rust, Python, and TypeScript, and a growing focus on **clinical UX and HealthTech architecture**. Built a portfolio-grade EHR sidecar demonstrating HIPAA-minded AI patterns, FHIR-inspired data modeling, and accessibility-first design for high-stress clinical environments. Background spans 100+ production deployments, REST API design, and **HIPAA/GDPR-aware operations** from healthcare-adjacent IT administration.

**Option B — Hybrid (IT + engineering — good for health systems IT / clinical informatics):**

> Systems and software engineer bridging **Linux/cloud administration** and **application development**. Experienced in secure operations (HIPAA, ISO 27001 awareness), automation, and building user-facing platforms. Recently architected a clinical workflow sidecar in Next.js showcasing progressive disclosure, semantic safety UI, and server-side PHI handling — combining operational rigor with modern front-end engineering.

---

## Featured Project (paste under Experience or Projects section)

### EHR Sidecar & Clinical Workflow Optimizer
**Personal Project / Portfolio Demo** · Remote · 2025 – 2026  
**GitHub:** https://github.com/feedmecode9m/ehr-sidecar-project · **Live Demo:** [add Vercel URL]

Architected a **Next.js 16 clinical sidecar panel** that augments legacy EHR workflows (Epic/Cerner-style) to reduce physician click fatigue — safety context, orders, and vitals in ≤2 interactions.

- Architected a Next.js App Router clinical dashboard with **URL-driven patient state** (`?patient=ID`), server-side FHIR mock aggregation, and shareable demo links — zero client-side PHI storage.
- Designed a **HIPAA-minded AI summarization workflow**: client sends only `noteId`; server performs note lookup, rule-based summarization, and returns derived fields — raw clinical text never crosses the network to the browser.
- Built **context-aware Smart Order Sets** and **Progressive Vitals** (collapsed summary → expandable Recharts trends via `next/dynamic` + `ssr: false`) to reduce cognitive load at bedside.
- Enforced **clinical UX standards**: WCAG 2.1 AA patterns, **44px touch targets**, semantic color triage (Red/Yellow/Green), icon + text labels for colorblind-safe allergy badges.
- Achieved **TypeScript strict mode**, zero `console.log` PHI leakage, Zod-validated API routes, and clean production builds.

**Tech:** Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, Recharts, Zod, mock FHIR data layer

---

## Condensed bullets (if space is tight — 2 lines)

- Built portfolio-grade **EHR Sidecar** (Next.js/TypeScript) with sticky allergy/code-status header, progressive vitals charts, and context-aware order sets — targeting physician click-fatigue reduction.
- Implemented **HIPAA-minded AI API** (noteId-only client payload, server-side note lookup, Zod validation) and WCAG 2.1 AA clinical UX (44px targets, semantic Red/Yellow/Green safety colors).

---

## Skills to ADD or emphasize (merge into your Skills section)

**Front-End & HealthTech (new row):**  
Next.js (App Router), TypeScript, React, Tailwind CSS, shadcn/ui, Recharts, FHIR-inspired data modeling, clinical UX / accessibility (WCAG 2.1 AA)

**Security & Compliance (emphasize existing):**  
HIPAA-minded architecture, PHI minimization, server-side aggregation, Zod input validation, least-privilege API design — *you already list HIPAA awareness; tie it to this project*

**Keep and cross-reference:**  
Python, Rust, Node.js, REST APIs, Docker, GitHub Actions/CI/CD, AWS/Azure/GCP, MongoDB/SQL, Splunk/log analysis

---

## How your existing experience supports HealthTech (talking points for interviews)

| Your background | HealthTech angle |
|-----------------|------------------|
| **South LA IT Admin** — HIPAA/GDPR awareness, access control, audit logs | "I've operated under compliance constraints in production environments." |
| **Reelforge** — Rust backend, 100+ deploys, multi-tenant SaaS, auth | "I've shipped reliable services with stable API contracts — same discipline clinical integrations need." |
| **Fresh-Tomatoes / wav2lip** — multimodal pipelines, high-volume data | "Clinical notes and vitals are another structured + unstructured data pipeline." |
| **Techtoysgadgets** — payment APIs, error handling, security remediation | "Third-party integrations with strict validation mirrors FHIR/SMART on FHIR patterns." |
| **EHR Sidecar** — portfolio proof | "I can speak to clinical UX, not just backend — allergies at a glance, progressive disclosure." |

---

## LinkedIn post (optional — copy/paste)

**Title idea:** Built a clinical EHR sidecar to fight click fatigue 🏥

I just shipped a portfolio demo: **EHR Sidecar & Quick-Action Panel** — a Next.js clinical UX prototype that sits beside legacy EHRs (Epic/Cerner) instead of replacing them.

What it demonstrates:
✅ Safety at a glance — allergies + code status in a sticky header  
✅ Context-aware order sets + progressive vitals (summary first, trends on demand)  
✅ HIPAA-minded AI — client sends only a note ID; server handles the rest  
✅ WCAG 2.1 AA — 44px touch targets, semantic colors, keyboard nav  

Try it: [Live Demo URL]  
Code: https://github.com/feedmecode9m/ehr-sidecar-project

Open to HealthTech, clinical informatics, and full-stack roles where UX and security both matter.

#HealthTech #ClinicalUX #NextJS #HIPAA #FHIR #OpenToWork

---

## Resume PDF tips

1. Add **EHR Sidecar** as the **first item** under a new **"Selected Projects"** section (above or below Reelforge).
2. Insert screenshot in portfolio site or LinkedIn Featured — file: `docs/screenshots/ehr-sidecar-demo.png` or your Downloads PNG.
3. Replace `[Live Demo Link]` after Vercel deploy (command below).
4. Your PDF already mentions **HIPAA awareness** — add one line in Summary referencing the EHR project as applied HIPAA-minded *engineering*, not just policy awareness.

---

## Deploy live demo (for resume link)

```bash
cd /home/youloose2dafish/projects/ehr-sidecar-project
npx vercel --prod
```

Then add the URL to README and resume: `https://ehr-sidecar-project-*.vercel.app/?patient=p1`

---

## Interview 60-second pitch

> "Legacy EHRs bury allergies and orders behind too many clicks. I built a sidecar panel in Next.js that shows safety context immediately — red allergy badges, code status — and surfaces context-aware order sets and vitals trends in one or two taps. For AI summarization, I used a pattern you'd want in production: the browser only sends a note ID, the server fetches and summarizes — raw PHI never hits the client. It's mock FHIR data, but the architecture is real."

---

## License note for resume

MIT — open source portfolio demo, synthetic patients only.
