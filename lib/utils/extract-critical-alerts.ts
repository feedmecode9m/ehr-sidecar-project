/**
 * Scans AI summary text for high-risk clinical keywords and elevates
 * short caregiver-facing alert strings for Critical Care Notes UX.
 * Client-safe — operates only on already-summarized display strings (no PHI logging).
 */

const CRITICAL_KEYWORDS = [
  "anaphylaxis",
  "allergy",
  "dnr",
  "do not resuscitate",
  "stat",
  "critical",
  "avoid",
  "non-compliance",
  "hemorrhage",
  "sepsis",
] as const;

/** Longer phrases first so "do not resuscitate" wins over partial matches. */
const KEYWORD_PATTERN = new RegExp(
  `\\b(${[...CRITICAL_KEYWORDS]
    .sort((a, b) => b.length - a.length)
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})\\b`,
  "gi",
);

function normalizeAlertKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/^⚠️\s*/u, "")
    .replace(/[^\w\s/-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sentenceContaining(haystack: string, keyword: string): string | null {
  const parts = haystack.split(/(?<=[.:;])\s+|\n+/);
  const lowerKeyword = keyword.toLowerCase();

  for (const part of parts) {
    if (part.toLowerCase().includes(lowerKeyword)) {
      const cleaned = part.replace(/\s+/g, " ").trim();
      if (cleaned.length > 0) {
        return cleaned.length > 120
          ? `${cleaned.slice(0, 117).trimEnd()}…`
          : cleaned;
      }
    }
  }

  return null;
}

function alertForKeyword(keyword: string, context: string | null): string {
  const lower = keyword.toLowerCase();
  if (context) {
    return `⚠️ ${context}`;
  }

  switch (lower) {
    case "anaphylaxis":
      return "⚠️ Anaphylaxis risk documented";
    case "allergy":
      return "⚠️ Allergy alert present";
    case "dnr":
    case "do not resuscitate":
      return "⚠️ DNR / do not resuscitate status";
    case "stat":
      return "⚠️ STAT order or action required";
    case "critical":
      return "⚠️ Critical clinical finding";
    case "avoid":
      return "⚠️ Avoid exposure or intervention noted";
    case "non-compliance":
      return "⚠️ Non-compliance affecting care";
    case "hemorrhage":
      return "⚠️ Hemorrhage concern";
    case "sepsis":
      return "⚠️ Sepsis concern";
    default:
      return `⚠️ ${keyword} flagged`;
  }
}

/**
 * Returns unique critical alert strings derived from summary content.
 * Empty array when no high-risk keywords are present.
 */
export function extractCriticalAlerts(
  summary: string,
  keyFindings: string[],
  actionItems: string[],
): string[] {
  const corpus = [summary, ...keyFindings, ...actionItems]
    .filter(Boolean)
    .join("\n");

  if (!corpus.trim()) {
    return [];
  }

  const seenKeywords = new Set<string>();
  const alerts: string[] = [];
  const seenAlertKeys = new Set<string>();

  for (const match of corpus.matchAll(KEYWORD_PATTERN)) {
    const keyword = match[1];
    if (!keyword) continue;

    const keywordKey = keyword.toLowerCase();
    if (seenKeywords.has(keywordKey)) continue;
    seenKeywords.add(keywordKey);

    const context = sentenceContaining(corpus, keyword);
    const alert = alertForKeyword(keyword, context);
    const alertKey = normalizeAlertKey(alert);

    if (seenAlertKeys.has(alertKey)) continue;
    seenAlertKeys.add(alertKey);
    alerts.push(alert);
  }

  return alerts;
}

/** Keywords used for inline bold highlighting in summary bullets. */
export const CRITICAL_HIGHLIGHT_KEYWORDS = [...CRITICAL_KEYWORDS];

/**
 * Splits text into segments, wrapping critical keywords in highlight markers.
 * Returns React-ready segment descriptors (no JSX — keeps util framework-agnostic).
 */
export function segmentCriticalKeywords(
  text: string,
): Array<{ text: string; highlight: boolean }> {
  if (!text) return [];

  const segments: Array<{ text: string; highlight: boolean }> = [];
  let lastIndex = 0;

  for (const match of text.matchAll(KEYWORD_PATTERN)) {
    const matched = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, index),
        highlight: false,
      });
    }

    segments.push({ text: matched, highlight: true });
    lastIndex = index + matched.length;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), highlight: false });
  }

  if (segments.length === 0) {
    return [{ text, highlight: false }];
  }

  return segments;
}
