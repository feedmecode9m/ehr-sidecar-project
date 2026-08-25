# EHR Sidecar & Quick-Action Panel

**A Clinical UX Demo for Reducing Click Fatigue in Legacy EHR Systems**

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-base--nova-000)
![HIPAA-Minded](https://img.shields.io/badge/Architecture-HIPAA--minded-green)

> **Demo:** [http://localhost:3000](http://localhost:3000) after `npm run dev`  
> **Note:** All patient data is synthetic mock FHIR — not for production PHI.

## Live Preview

Eleanor Vance (`/?patient=p1`) — sticky safety header, progressive vitals, CHF order set, and AI clinical summary:

![EHR Sidecar demo — Eleanor Vance CHF patient view showing allergy badges, vitals, CHF Exacerbation Panel, and AI Clinical Summary](./docs/screenshots/ehr-sidecar-demo.png)

*Screenshot: Sidecar panel with red allergy badges (Penicillin, Latex), vitals row, CHF Exacerbation Panel, and generated AI summary.*

---

## The Clinical Problem

Physicians using legacy EHR systems (Epic, Cerner, Meditech) spend **2+ hours per day** on administrative clicks — chart navigation, order entry, and documentation hunting. Research consistently links EHR burden to clinician burnout and reduced face-time with patients.

The core issue isn't missing data — it's **cognitive and click load**. Critical safety context (allergies, code status) and workflow actions (order sets, vitals trends) are buried behind multiple screens and modals.

---

## The Solution

This project demonstrates a **clinical sidecar panel** — a focused UI that augments (not replaces) legacy EHRs. It lives beside the main chart and surfaces high-value workflow actions in **≤ 2 clicks**.

### Three Workflow Optimizations

| Optimization | What it does | Click budget |
|---|---|---|
| **Safety at a glance** | Allergies + code status in sticky header | 0 clicks |
| **Context-aware ordering** | Smart order sets matched to diagnosis/vitals | 1–2 clicks |
| **Progressive vitals review** | Latest vitals summary → expand for 48h trends | 1 click |

---

## Architecture

```mermaid
flowchart TB
  subgraph Client["Client (Browser)"]
    URL["URL ?patient=p1"]
    UI["React Client Components\n(Vitals, Orders, AI button)"]
  end

  subgraph Server["Next.js Server"]
    Page["app/page.tsx\n(Server Component)"]
    Ctx["getPatientContext()"]
    Mock["lib/fhir/mock/*"]
    API["POST /api/summarize"]
    Sum["summarizeClinicalNote()"]
  end

  URL --> Page
  Page --> Ctx
  Ctx --> Mock
  Page --> UI

  UI -->|"POST { noteId } only"| API
  API --> Mock
  API --> Sum
  Sum -->|"summary, keyFindings, actionItems"| UI

  style Client fill:#f8fafc,stroke:#64748b
  style Server fill:#ecfdf5,stroke:#059669
```

**Key security pattern:** The client sends only a `noteId` to `/api/summarize`. The server looks up the raw clinical note, generates a summary, and returns **derived fields only**. Raw PHI never appears in client code or network payloads.

---

## Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| Framework | Next.js 16 (App Router) | Server Components, API Routes |
| Language | TypeScript | Strict typing, no `any` |
| Styling | Tailwind CSS v4 | Clinical semantic tokens, responsive design |
| UI Components | shadcn/ui | Accessible primitives (Button, Badge, Card, etc.) |
| State | URL Search Params | Shareable, stateless patient selection |
| Charts | Recharts (`dynamic`, `ssr: false`) | Vitals trend visualization |
| Validation | Zod | API input validation |
| Icons | lucide-react | Clinical iconography |

---

## Clinical UX Principles Applied

- **Semantic colors:** Red = critical/allergy · Yellow = warning · Green = normal/stable
- **44px touch targets** (`min-h-11`) for tablet bedside use
- **Progressive disclosure** — vitals and order sets collapsed by default
- **High contrast** for bright hospital environments
- **WCAG 2.1 AA** — icon + text labels (color never the sole indicator)
- **Keyboard navigation** — focus rings, `aria-expanded`, labeled controls

---

## Security & HIPAA-Minded Architecture

This is a **portfolio demo with synthetic data**, built using production-grade patterns:

| Rule | Implementation |
|------|----------------|
| No PHI on client | Server-only `getPatientContext()` aggregation |
| AI noteId pattern | Client POSTs `{ noteId }` → server lookup → summary only |
| No PHI logging | Zero `console.log` of patient data (verified) |
| Input validation | Zod schema on `/api/summarize` |
| Shareable state | Patient context via `?patient=ID` URL param (not localStorage) |

---

## Demo Script (60 seconds)

### Step 1 — Eleanor Vance (CHF)
Open **[/?patient=p1](http://localhost:3000/?patient=p1)**

1. **Header:** Red Penicillin + Latex allergy badges, green Full Code
2. **Vitals:** Latest BP/HR/SpO₂ with semantic status dots → click **Expand trends** for 48h Recharts
3. **Orders:** CHF Exacerbation Panel → expand to 6 orders → select + **Add Selected Orders**
4. **AI:** Click **Generate AI Summary** → skeleton (~800ms) → structured summary card

### Step 2 — Marcus Thorne (Sepsis)
Open **[/?patient=p2](http://localhost:3000/?patient=p2)**

1. **Header:** Green NKDA badge, red DNR
2. **Vitals:** Expand trends — critical hypotension + tachycardia pattern
3. **Orders:** Sepsis Workup with STAT priorities
4. **AI:** ICU/sepsis-focused summary

### Step 3 — Jane Doe (Minimal chart)
Open **[/?patient=p4](http://localhost:3000/?patient=p4)**

1. **Vitals:** Limited data points
2. **AI:** Empty state — "No clinical note available"
3. Demonstrates graceful degradation

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for production

```bash
npm run build
npm start
```

### Environment variables

Copy `.env.example` to `.env.local` for future integrations. **Not required for the demo.**

---

## Project Structure

```
app/
  page.tsx                 # Server Component — fetches PatientContext
  api/summarize/route.ts   # HIPAA-minded AI summarization endpoint
components/clinical/       # Domain components (header, vitals, orders, AI)
lib/fhir/
  types.ts                 # Strict FHIR-inspired TypeScript interfaces
  mock/                    # Synthetic patient data (server-safe)
  get-patient-context.ts   # Server-only aggregator
  summarize-note.ts        # Rule-based mock summarizer
.cursor/rules/             # Persona rules (PM, UX, FE, Security)
```

---

## Future Roadmap

- [ ] Connect to real FHIR server (Epic Cosmos, Cerner Code)
- [ ] SMART on FHIR OAuth 2.0 authentication
- [ ] Production LLM integration with PHI redaction pipeline
- [ ] Real-time vitals via WebSocket / HL7 FHIR subscriptions
- [ ] Deploy to HIPAA-eligible infrastructure (AWS/Azure BAA)

---

## Screenshots

| Patient | URL | Scenario |
|---------|-----|----------|
| Eleanor Vance | `/?patient=p1` | CHF + severe allergies + order set + AI summary (**[see above](#live-preview)**) |
| Marcus Thorne | `/?patient=p2` | Sepsis + DNR + critical vitals |
| Leo Rossi | `/?patient=p3` | Pediatric asthma + peanut allergy |
| Jane Doe | `/?patient=p4` | Minimal chart + empty states |

---

## License

MIT
