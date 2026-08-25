import type { ClinicalNote } from "@/lib/fhir/types";

export interface ClinicalSummary {
  summary: string;
  keyFindings: string[];
  actionItems: string[];
  generatedAt: string;
}

function includesAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword.toLowerCase()));
}

function extractAssessmentLines(text: string): string[] {
  const lines = text.split("\n").map((line) => line.trim());
  const findings: string[] = [];

  for (const line of lines) {
    if (/^\d+\./.test(line) || line.startsWith("- ")) {
      const cleaned = line.replace(/^\d+\.\s*/, "").replace(/^-\s*/, "");
      if (cleaned.length > 10 && cleaned.length < 160) {
        findings.push(cleaned);
      }
    }
  }

  return findings.slice(0, 4);
}

function extractPlanItems(text: string): string[] {
  const planSection = text.split(/PLAN:|TREATMENT PLAN:|ASSESSMENT\/PLAN:/i)[1];
  if (!planSection) return [];

  return planSection
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-") || /^\d+\./.test(line))
    .map((line) => line.replace(/^\d+\.\s*/, "").replace(/^-\s*/, ""))
    .filter((line) => line.length > 8 && line.length < 160)
    .slice(0, 5);
}

/**
 * Rule-based mock summarization — simulates GenAI output without an external LLM.
 * Raw note text never leaves this server-side module.
 */
export function summarizeClinicalNote(note: ClinicalNote): ClinicalSummary {
  const text = note.text;
  const generatedAt = new Date().toISOString();

  if (includesAny(text, ["chf", "heart failure", "dyspnea", "edema"])) {
    return {
      summary:
        "Acute-on-chronic heart failure exacerbation with volume overload, dyspnea, and lower-extremity edema. Patient remains hemodynamically stable at rest with active diuresis and monitoring.",
      keyFindings: [
        "Worsening dyspnea and weight gain over 3 days",
        "Bibasilar crackles and 2+ pitting edema on exam",
        "History of reduced diuretic compliance reported",
        "Penicillin anaphylaxis and severe latex allergy documented",
        ...extractAssessmentLines(text).slice(0, 1),
      ].slice(0, 4),
      actionItems: [
        "Continue IV diuresis with strict intake/output and daily weights",
        "Maintain fluid restriction and repeat BNP/BMP monitoring",
        "Verify allergy band and avoid beta-lactam exposure",
        ...extractPlanItems(text).slice(0, 2),
      ].slice(0, 4),
      generatedAt,
    };
  }

  if (includesAny(text, ["septic", "hypotension", "lactate", "icu"])) {
    return {
      summary:
        "Critically ill patient with evolving hemodynamic instability and concern for septic shock. Requires ongoing resuscitation, infectious workup, and close ICU monitoring.",
      keyFindings: [
        "Recurrent hypotension with persistent tachycardia overnight",
        "Elevated lactate suggesting tissue hypoperfusion",
        "Possible pulmonary infiltrate on chest imaging",
        "DNR/DNI status verified per POLST",
        ...extractAssessmentLines(text).slice(0, 1),
      ].slice(0, 4),
      actionItems: [
        "Complete sepsis bundle and repeat lactate within 2 hours",
        "Trend vitals every 15 minutes and reassess perfusion",
        "Evaluate need for central access if fluids fail to stabilize MAP",
        ...extractPlanItems(text).slice(0, 2),
      ].slice(0, 4),
      generatedAt,
    };
  }

  if (includesAny(text, ["asthma", "wheez", "bronchospasm", "duoneb"])) {
    return {
      summary:
        "Pediatric acute asthma exacerbation following URI symptoms, with improved work of breathing after initial bronchodilator and steroid therapy.",
      keyFindings: [
        "Diffuse expiratory wheeze with prior hypoxemia on arrival",
        "Partial response to nebulized bronchodilator therapy",
        "Known moderate peanut allergy — epinephrine available at bedside",
        ...extractAssessmentLines(text).slice(0, 1),
      ].slice(0, 4),
      actionItems: [
        "Continue scheduled bronchodilator and steroid pathway",
        "Maintain continuous pulse oximetry and wean oxygen to SpO₂ goal",
        "Complete asthma action plan education prior to discharge",
        ...extractPlanItems(text).slice(0, 2),
      ].slice(0, 4),
      generatedAt,
    };
  }

  const fallbackFindings = extractAssessmentLines(text);
  const fallbackActions = extractPlanItems(text);

  return {
    summary: `Clinical note (${note.noteType}) reviewed. Key assessment and plan elements extracted for quick reference.`,
    keyFindings:
      fallbackFindings.length > 0
        ? fallbackFindings
        : ["No structured assessment lines detected in note."],
    actionItems:
      fallbackActions.length > 0
        ? fallbackActions
        : ["Review full note in chart for complete plan details."],
    generatedAt,
  };
}
