import type { Patient } from "@/lib/fhir/types";

export const mockPatients: Patient[] = [
  {
    id: "p1",
    resourceType: "Patient",
    name: "Eleanor Vance",
    age: 72,
    sex: "F",
    mrn: "MRN-0048217",
    location: "Med/Surg 4B · Room 412 · Bed A",
    primaryDiagnosis: "Congestive Heart Failure (CHF)",
    codeStatus: "Full Code",
  },
  {
    id: "p2",
    resourceType: "Patient",
    name: "Marcus Thorne",
    age: 45,
    sex: "M",
    mrn: "MRN-0091033",
    location: "ICU 2 · Room 208 · Bed B",
    primaryDiagnosis: "Type 2 Diabetes Mellitus",
    codeStatus: "DNR",
  },
  {
    id: "p3",
    resourceType: "Patient",
    name: "Leo Rossi",
    age: 8,
    sex: "M",
    mrn: "MRN-0029104",
    location: "Peds 3 · Room 318 · Bed A",
    primaryDiagnosis: "Acute Asthma Exacerbation",
    codeStatus: "Full Code",
  },
  {
    id: "p4",
    resourceType: "Patient",
    name: "Jane Doe",
    age: 30,
    sex: "F",
    mrn: "MRN-0000001",
    location: "Observation · Room 102",
    primaryDiagnosis: "Under evaluation",
    codeStatus: "Full Code",
  },
];

export const DEFAULT_PATIENT_ID = "p1";

export function getPatientById(patientId: string): Patient | undefined {
  return mockPatients.find((patient) => patient.id === patientId);
}
