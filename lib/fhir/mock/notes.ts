import type { ClinicalNote } from "@/lib/fhir/types";

export const mockNotes: ClinicalNote[] = [
  {
    id: "n1",
    patientId: "p1",
    authoredAt: "2026-08-25T08:14:00Z",
    author: "Dr. Sarah Chen, MD",
    noteType: "Progress Note",
    text: `CHF EXACERBATION — PROGRESS NOTE

72 yo F w/ hx CHF (EF 35% per echo 2024), HTN, CKD stage 3, admitted 8/23 for worsening DOE and 2+ pitting edema BLE. 

SUBJECTIVE:
Pt reports increased SOB w/ minimal exertion x 3 days. Denies chest pain. States she "couldn't lay flat last night." Increased weight per pt report — states 4 lbs over baseline (baseline ~168 per last clinic note). Compliance w/ lasix "mostly" — missed 1 dose over weekend per pt report.

OBJECTIVE:
Vitals as charted. Appears fatigued but NAD at rest.
Lungs: bibasilar crackles, no wheeze
CV: RRR, 2+ LE edema to mid-shin
Labs pending — BMP, BNP ordered this AM

ASSESSMENT/PLAN:
1. Acute on chronic systolic CHF exacerbation — likely dietary indiscretion vs med non-compliance
   - Continue IV lasix 40mg BID, strict I/O, daily weights
   - Fluid restriction 1.5L
   - Echo if no improvement 48h
2. HTN — hold lisinopril if MAP <65, currently borderline
3. ALLERGIES: *** PENICILLIN — ANAPHYLAXIS *** LATEX — SEVERE — verify band & cart
4. Code Status: Full Code (confirmed w/ pt 8/23)

Note copied from admission H&P below for reference — please see original for complete hx:

ADMISSION H&P (excerpt):
72F presents w/ progressive dyspnea... hx penicillin allergy documented in 3 locations... NKDA listed on outside records INCORRECT per pt and daughter at bedside...

Electronically signed: Dr. Sarah Chen, MD
8/25/2026 08:14`,
  },
  {
    id: "n2",
    patientId: "p2",
    authoredAt: "2026-08-25T06:42:00Z",
    author: "NP James Okonkwo, NP",
    noteType: "ICU Progress Note",
    text: `ICU PROGRESS NOTE — Marcus Thorne

45M w/ T2DM (A1c 9.2%), HTN, OSA, admitted from ED 8/24 w/ hyperglycemia, weakness, and now evolving hemodynamic instability.

OVERNIGHT EVENTS:
03:15 — RN called for hypotension BP 82/54, HR 124. 500cc NS bolus given w/ transient improvement.
05:00 — Repeat BP 78/50, lactate 3.8 (prior 2.1). ICU fellow notified.

CURRENT STATUS:
Pt lethargic but arousable. Skin warm, cap refill ~3 sec. No focal neuro deficits.

INFECTIOUS WORKUP:
UA pending. BCx x2 drawn 8/24 @ 2200. CXR: RLL infiltrate vs atelectasis — read pending official rad.

MEDS:
- Insulin gtt per protocol
- Vancomycin + Zosyn (d/c Zosyn if pcn allergy — ** pt NKDA **)
- Levophed initiated 06:30 @ 4 mcg/min

CODE STATUS: DNR/DNI per POLST uploaded to chart & verified w/ wife at bedside 8/24. Full code order in chart from 2019 — ** OUTDATED ** POLST supersedes.

ASSESSMENT:
1. Septic shock vs other — MAP trending down, tachycardia persistent
2. T2DM w/ hyperglycemia — improving on gtt
3. AKI — Cr 1.9 from baseline 1.1, monitor UOP q1h

PLAN:
- Continue sepsis bundle, repeat lactate in 2h
- Consider central line if no improvement after 2nd fluid bolus
- Trend vitals q15min
- Readdress code status w/ family if clinical deterioration

Dictated but not read. Minor formatting inconsistencies may exist.

Signed: J. Okonkwo, NP
8/25/2026 06:42`,
  },
  {
    id: "n3",
    patientId: "p3",
    authoredAt: "2026-08-25T10:05:00Z",
    author: "Dr. Emily Park, MD (Peds)",
    noteType: "Asthma Exacerbation Note",
    text: `PEDIATRIC ADMISSION — ACUTE ASTHMA EXACERBATION

8 yo M (DOB verified) — Leo Rossi — known peanut allergy (moderate, hives/GI per mom), hx intermittent asthma, presents w/ 2 day URI symptoms then acute wheezing and retractions.

HPI (per mom + pt where appropriate):
Started w/ runny nose Monday. Albuterol at home x4 w/ minimal relief. Worse overnight — speaking in short sentences on arrival. No fever documented at home. Last albuterol dose 07:30 today. Mom reports prior ED visit 2024 for similar, no intubation.

EXAM:
General: awake, mild distress, speaking full sentences after initial tx
Resp: diffuse exp wheeze bilaterally, mild subcostal retractions — improved from ED
HEENT: no stridor
Skin: no urticaria

ED COURSE (copied from triage note):
SpO2 89% RA -> 96% on 2L NC after duoneb x1 and solumedrol 2mg/kg
RR 34 -> 24 after tx

ALLERGIES: Peanuts — MODERATE — avoid hospital meal tray w/ nuts, epinephrine pen at bedside (mom brought EpiPen Jr)

TREATMENT PLAN:
1. Continue duoneb q20min x3, then q4h scheduled
2. Solumedrol daily x3 days, transition to PO pred if improved
3. Continuous pulse ox, wean O2 to keep SpO2 >92%
4. Parent education re: action plan — asthma action plan form in chart INCOMPLETE pls fill before dc

CODE STATUS: Full Code (pediatric default, confirmed w/ parents)

Dispo: admit peds floor, anticipate 24-48h if cont improvement

Dr. Emily Park, MD
Peds Hospital Medicine
8/25/2026`,
  },
];

export function getNoteByPatientId(patientId: string): ClinicalNote | null {
  return mockNotes.find((note) => note.patientId === patientId) ?? null;
}

export function getNoteById(noteId: string): ClinicalNote | null {
  return mockNotes.find((note) => note.id === noteId) ?? null;
}
