import type { Allergy } from "@/lib/fhir/types";

export const mockAllergies: Allergy[] = [
  {
    id: "a1",
    patientId: "p1",
    substance: "Penicillin",
    severity: "life-threatening",
    reaction: "Anaphylaxis, angioedema",
    verified: true,
    onsetDate: "1978-06-12",
  },
  {
    id: "a2",
    patientId: "p1",
    substance: "Latex",
    severity: "severe",
    reaction: "Contact urticaria, bronchospasm",
    verified: true,
    onsetDate: "2010-03-04",
  },
  {
    id: "a3",
    patientId: "p1",
    substance: "Penicillin",
    severity: "life-threatening",
    reaction: "Anaphylaxis",
    verified: false,
    onsetDate: "1978-06-12",
  },
  {
    id: "a4",
    patientId: "p3",
    substance: "Peanuts",
    severity: "moderate",
    reaction: "Hives, GI upset per caregiver report",
    verified: true,
    onsetDate: "2021-09-15",
  },
];

export function getAllergiesByPatientId(patientId: string): Allergy[] {
  return mockAllergies.filter((allergy) => allergy.patientId === patientId);
}
