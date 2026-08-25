/**
 * Server-only module — aggregates mock FHIR data for the clinical sidecar.
 * Must not be imported from Client Components.
 */
import "server-only";

import { getAllergiesByPatientId } from "@/lib/fhir/mock/allergies";
import { getNoteByPatientId } from "@/lib/fhir/mock/notes";
import { getOrderSetsByPatientId } from "@/lib/fhir/mock/order-sets";
import {
  DEFAULT_PATIENT_ID,
  getPatientById,
  mockPatients,
} from "@/lib/fhir/mock/patients";
import { getVitalsByPatientId } from "@/lib/fhir/mock/vitals";
import type { LatestVitals, PatientContext, VitalType } from "@/lib/fhir/types";

const SIMULATED_FETCH_DELAY_MS = 300;

const vitalTypes: VitalType[] = [
  "bloodPressure",
  "heartRate",
  "oxygenSaturation",
  "temperature",
  "respiratoryRate",
];

function buildLatestVitals(patientId: string): LatestVitals {
  const vitals = getVitalsByPatientId(patientId);
  const latest: LatestVitals = {};

  for (const type of vitalTypes) {
    const match = vitals.find((vital) => vital.type === type);
    if (match) {
      latest[type] = match;
    }
  }

  return latest;
}

function resolvePatientId(patientId: string | null | undefined): string {
  if (!patientId || !getPatientById(patientId)) {
    return DEFAULT_PATIENT_ID;
  }
  return patientId;
}

export async function getPatientContext(
  patientId: string,
): Promise<PatientContext> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_FETCH_DELAY_MS));

  const resolvedId = resolvePatientId(patientId);
  const patient = getPatientById(resolvedId);

  if (!patient) {
    throw new Error("Default patient configuration is missing.");
  }

  return {
    patient,
    allergies: getAllergiesByPatientId(resolvedId),
    vitals: getVitalsByPatientId(resolvedId),
    latestVitals: buildLatestVitals(resolvedId),
    note: getNoteByPatientId(resolvedId),
    orderSets: getOrderSetsByPatientId(resolvedId),
    fetchedAt: new Date().toISOString(),
  };
}

export function getAvailablePatientIds(): string[] {
  return mockPatients.map((patient) => patient.id);
}
