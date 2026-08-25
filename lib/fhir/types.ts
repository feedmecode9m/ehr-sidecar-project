export type AllergySeverity = "life-threatening" | "severe" | "moderate";

export type CodeStatus = "Full Code" | "DNR" | "Limited";

export type Sex = "M" | "F";

export type VitalStatus = "normal" | "warning" | "critical";

export type VitalType =
  | "bloodPressure"
  | "heartRate"
  | "oxygenSaturation"
  | "temperature"
  | "respiratoryRate";

export type OrderPriority = "stat" | "urgent" | "routine";

export interface Patient {
  id: string;
  resourceType: "Patient";
  name: string;
  age: number;
  sex: Sex;
  mrn: string;
  location: string;
  primaryDiagnosis: string;
  codeStatus: CodeStatus;
}

export interface Allergy {
  id: string;
  patientId: string;
  substance: string;
  severity: AllergySeverity;
  reaction: string;
  verified: boolean;
  onsetDate?: string;
}

export interface VitalSign {
  id: string;
  patientId: string;
  type: VitalType;
  timestamp: string;
  value: string;
  unit: string;
  status: VitalStatus;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  authoredAt: string;
  author: string;
  noteType: string;
  text: string;
}

export interface OrderSetItem {
  id: string;
  name: string;
  priority: OrderPriority;
  category: string;
}

export interface OrderSet {
  id: string;
  name: string;
  indication: string;
  conditionTags: string[];
  vitalThresholds?: string[];
  orders: OrderSetItem[];
}

export interface LatestVitals {
  bloodPressure?: VitalSign;
  heartRate?: VitalSign;
  oxygenSaturation?: VitalSign;
  temperature?: VitalSign;
  respiratoryRate?: VitalSign;
}

export interface PatientContext {
  patient: Patient;
  allergies: Allergy[];
  vitals: VitalSign[];
  latestVitals: LatestVitals;
  note: ClinicalNote | null;
  orderSets: OrderSet[];
  fetchedAt: string;
}
