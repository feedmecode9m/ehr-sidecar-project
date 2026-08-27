# 60-Second Walkthrough Script

Use this as a calm, collaborative verbal demo for interviews, portfolio reviews, or stakeholder walkthroughs. All patients are synthetic.

---

## The Hook (≈10s)

We noticed that physicians waste hours navigating clunky legacy EHRs — not because the data is missing, but because allergies, code status, and common orders are buried behind too many clicks. That click fatigue takes time away from the bedside.

---

## The Solution (≈20s)

So, we designed this Next.js sidecar to live alongside the EHR. It features a sticky header so allergies and code status are always visible, and context-aware order sets to cut common workflows from 10 clicks down to 2. Progressive vitals keep the latest numbers up front and trends one tap away.

---

## The Safety & Security (≈20s)

Crucially, we architected a HIPAA-minded AI summarizer. The browser only sends a `noteId` to the server. Raw PHI never touches the client. We even added a clinical safety layer that automatically scans the AI output for high-risk keywords like “anaphylaxis” and renders a prominent red **Critical Care Notes** banner — so caregivers see danger signals before they read a wall of text.

---

## The Tech (≈10s)

It’s built with strict TypeScript, WCAG accessibility, and is fully responsive for bedside tablets. We’d love to show you how it works.

---

## Optional live clicks (if time allows)

1. Open `/?patient=p1` — point to Penicillin / Latex badges and Full Code.  
2. Generate AI Summary — pause on the **Critical Care Notes** banner.  
3. Switch to `/?patient=p4` — show empty states when the chart has no note.  
4. Mention the repo README architecture diagram for the `noteId`-only pattern.

---

## Tone reminders

- Prefer **we / this project / our approach** over “I built.”  
- Emphasize the **clinical problem** and **safety**, then the implementation.  
- Stay humble: this is a portfolio-grade demo with synthetic data, not a production EHR.
