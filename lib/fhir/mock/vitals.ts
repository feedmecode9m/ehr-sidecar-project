import type { VitalSign, VitalStatus, VitalType } from "@/lib/fhir/types";

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function vital(
  id: string,
  patientId: string,
  type: VitalType,
  hoursOffset: number,
  value: string,
  unit: string,
  status: VitalStatus,
): VitalSign {
  return {
    id,
    patientId,
    type,
    timestamp: hoursAgo(hoursOffset),
    value,
    unit,
    status,
  };
}

/** Eleanor Vance — CHF: elevated BP warnings, stable SpO2, occasional weight-related dyspnea context */
const p1Vitals: VitalSign[] = [
  vital("v1-1", "p1", "bloodPressure", 46, "158/94", "mmHg", "warning"),
  vital("v1-2", "p1", "heartRate", 46, "88", "bpm", "normal"),
  vital("v1-3", "p1", "oxygenSaturation", 46, "96", "%", "normal"),
  vital("v1-4", "p1", "bloodPressure", 38, "162/98", "mmHg", "warning"),
  vital("v1-5", "p1", "heartRate", 38, "92", "bpm", "normal"),
  vital("v1-6", "p1", "respiratoryRate", 38, "20", "/min", "normal"),
  vital("v1-7", "p1", "bloodPressure", 30, "148/90", "mmHg", "warning"),
  vital("v1-8", "p1", "heartRate", 30, "86", "bpm", "normal"),
  vital("v1-9", "p1", "temperature", 30, "98.4", "°F", "normal"),
  vital("v1-10", "p1", "bloodPressure", 22, "154/92", "mmHg", "warning"),
  vital("v1-11", "p1", "oxygenSaturation", 22, "95", "%", "normal"),
  vital("v1-12", "p1", "heartRate", 22, "90", "bpm", "normal"),
  vital("v1-13", "p1", "bloodPressure", 14, "150/88", "mmHg", "warning"),
  vital("v1-14", "p1", "respiratoryRate", 14, "22", "/min", "warning"),
  vital("v1-15", "p1", "bloodPressure", 8, "146/86", "mmHg", "normal"),
  vital("v1-16", "p1", "heartRate", 8, "84", "bpm", "normal"),
  vital("v1-17", "p1", "oxygenSaturation", 8, "97", "%", "normal"),
  vital("v1-18", "p1", "temperature", 8, "98.1", "°F", "normal"),
  vital("v1-19", "p1", "bloodPressure", 2, "142/84", "mmHg", "normal"),
  vital("v1-20", "p1", "heartRate", 2, "82", "bpm", "normal"),
];

/** Marcus Thorne — trending abnormal: hypotension + tachycardia worsening over 48h */
const p2Vitals: VitalSign[] = [
  vital("v2-1", "p2", "bloodPressure", 47, "118/76", "mmHg", "normal"),
  vital("v2-2", "p2", "heartRate", 47, "88", "bpm", "normal"),
  vital("v2-3", "p2", "oxygenSaturation", 47, "97", "%", "normal"),
  vital("v2-4", "p2", "bloodPressure", 40, "112/72", "mmHg", "normal"),
  vital("v2-5", "p2", "heartRate", 40, "94", "bpm", "normal"),
  vital("v2-6", "p2", "temperature", 40, "99.1", "°F", "warning"),
  vital("v2-7", "p2", "bloodPressure", 32, "102/68", "mmHg", "warning"),
  vital("v2-8", "p2", "heartRate", 32, "102", "bpm", "warning"),
  vital("v2-9", "p2", "respiratoryRate", 32, "22", "/min", "warning"),
  vital("v2-10", "p2", "bloodPressure", 24, "94/62", "mmHg", "warning"),
  vital("v2-11", "p2", "heartRate", 24, "112", "bpm", "warning"),
  vital("v2-12", "p2", "oxygenSaturation", 24, "94", "%", "warning"),
  vital("v2-13", "p2", "bloodPressure", 18, "88/58", "mmHg", "critical"),
  vital("v2-14", "p2", "heartRate", 18, "118", "bpm", "critical"),
  vital("v2-15", "p2", "temperature", 18, "100.4", "°F", "warning"),
  vital("v2-16", "p2", "bloodPressure", 12, "82/54", "mmHg", "critical"),
  vital("v2-17", "p2", "heartRate", 12, "124", "bpm", "critical"),
  vital("v2-18", "p2", "respiratoryRate", 12, "26", "/min", "warning"),
  vital("v2-19", "p2", "bloodPressure", 4, "78/50", "mmHg", "critical"),
  vital("v2-20", "p2", "heartRate", 4, "128", "bpm", "critical"),
];

/** Leo Rossi — acute asthma: SpO2 dips, elevated RR, improving with treatment */
const p3Vitals: VitalSign[] = [
  vital("v3-1", "p3", "oxygenSaturation", 45, "91", "%", "warning"),
  vital("v3-2", "p3", "respiratoryRate", 45, "32", "/min", "critical"),
  vital("v3-3", "p3", "heartRate", 45, "118", "bpm", "warning"),
  vital("v3-4", "p3", "bloodPressure", 45, "102/68", "mmHg", "normal"),
  vital("v3-5", "p3", "oxygenSaturation", 36, "89", "%", "critical"),
  vital("v3-6", "p3", "respiratoryRate", 36, "34", "/min", "critical"),
  vital("v3-7", "p3", "heartRate", 36, "122", "bpm", "warning"),
  vital("v3-8", "p3", "temperature", 36, "99.8", "°F", "normal"),
  vital("v3-9", "p3", "oxygenSaturation", 28, "92", "%", "warning"),
  vital("v3-10", "p3", "respiratoryRate", 28, "28", "/min", "warning"),
  vital("v3-11", "p3", "heartRate", 28, "108", "bpm", "warning"),
  vital("v3-12", "p3", "bloodPressure", 28, "98/64", "mmHg", "normal"),
  vital("v3-13", "p3", "oxygenSaturation", 20, "94", "%", "warning"),
  vital("v3-14", "p3", "respiratoryRate", 20, "24", "/min", "warning"),
  vital("v3-15", "p3", "heartRate", 20, "102", "bpm", "normal"),
  vital("v3-16", "p3", "oxygenSaturation", 12, "96", "%", "normal"),
  vital("v3-17", "p3", "respiratoryRate", 12, "22", "/min", "normal"),
  vital("v3-18", "p3", "heartRate", 12, "96", "bpm", "normal"),
  vital("v3-19", "p3", "oxygenSaturation", 3, "97", "%", "normal"),
  vital("v3-20", "p3", "respiratoryRate", 3, "20", "/min", "normal"),
];

/** Jane Doe — minimal chart for empty-state testing */
const p4Vitals: VitalSign[] = [
  vital("v4-1", "p4", "bloodPressure", 6, "118/72", "mmHg", "normal"),
  vital("v4-2", "p4", "heartRate", 6, "76", "bpm", "normal"),
];

export const mockVitals: VitalSign[] = [
  ...p1Vitals,
  ...p2Vitals,
  ...p3Vitals,
  ...p4Vitals,
];

export function getVitalsByPatientId(patientId: string): VitalSign[] {
  return mockVitals
    .filter((v) => v.patientId === patientId)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
}
