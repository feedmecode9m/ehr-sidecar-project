import type { OrderSet } from "@/lib/fhir/types";

export const mockOrderSets: OrderSet[] = [
  {
    id: "os-chf",
    name: "CHF Exacerbation Panel",
    indication: "Volume overload with worsening dyspnea in known systolic CHF",
    conditionTags: ["CHF", "heart failure", "volume overload"],
    orders: [
      {
        id: "os-chf-1",
        name: "BMP (Basic Metabolic Panel)",
        priority: "routine",
        category: "Lab",
      },
      {
        id: "os-chf-2",
        name: "BNP (B-type Natriuretic Peptide)",
        priority: "routine",
        category: "Lab",
      },
      {
        id: "os-chf-3",
        name: "Daily Weight (Standing)",
        priority: "routine",
        category: "Nursing",
      },
      {
        id: "os-chf-4",
        name: "Strict Intake & Output",
        priority: "routine",
        category: "Nursing",
      },
      {
        id: "os-chf-5",
        name: "Furosemide 40 mg IV BID",
        priority: "urgent",
        category: "Medication",
      },
      {
        id: "os-chf-6",
        name: "2L Fluid Restriction",
        priority: "routine",
        category: "Diet",
      },
    ],
  },
  {
    id: "os-sepsis",
    name: "Sepsis Workup",
    indication: "Hypotension with tachycardia and rising lactate — evaluate for sepsis",
    conditionTags: ["sepsis", "hypotension", "tachycardia", "diabetes"],
    vitalThresholds: ["SBP < 90", "MAP < 65", "HR > 110"],
    orders: [
      {
        id: "os-sepsis-1",
        name: "Blood Cultures x2 (Different Sites)",
        priority: "stat",
        category: "Lab",
      },
      {
        id: "os-sepsis-2",
        name: "Lactate Level (Repeat in 2h)",
        priority: "stat",
        category: "Lab",
      },
      {
        id: "os-sepsis-3",
        name: "CBC with Differential",
        priority: "stat",
        category: "Lab",
      },
      {
        id: "os-sepsis-4",
        name: "Chest X-Ray (Portable AP)",
        priority: "urgent",
        category: "Imaging",
      },
      {
        id: "os-sepsis-5",
        name: "Normal Saline Bolus 30 mL/kg",
        priority: "stat",
        category: "Medication",
      },
      {
        id: "os-sepsis-6",
        name: "Broad-Spectrum Antibiotics (Within 1h)",
        priority: "stat",
        category: "Medication",
      },
      {
        id: "os-sepsis-7",
        name: "Vitals q15min Until Stable",
        priority: "urgent",
        category: "Nursing",
      },
    ],
  },
  {
    id: "os-asthma",
    name: "Asthma Rescue",
    indication: "Acute bronchospasm with hypoxemia and increased work of breathing",
    conditionTags: ["asthma", "bronchospasm", "pediatric"],
    vitalThresholds: ["SpO2 < 92%", "RR > 28"],
    orders: [
      {
        id: "os-asthma-1",
        name: "Albuterol/Ipratropium Nebulizer q20min x3",
        priority: "stat",
        category: "Medication",
      },
      {
        id: "os-asthma-2",
        name: "Methylprednisolone IV (Weight-Based)",
        priority: "urgent",
        category: "Medication",
      },
      {
        id: "os-asthma-3",
        name: "Continuous Pulse Oximetry",
        priority: "urgent",
        category: "Monitoring",
      },
      {
        id: "os-asthma-4",
        name: "Supplemental O2 (Target SpO2 92–96%)",
        priority: "urgent",
        category: "Respiratory",
      },
      {
        id: "os-asthma-5",
        name: "Peak Flow When Able",
        priority: "routine",
        category: "Nursing",
      },
    ],
  },
  {
    id: "os-admission",
    name: "Basic Admission Panel",
    indication: "Standard admission orders for new observation patients",
    conditionTags: ["admission", "observation"],
    orders: [
      {
        id: "os-adm-1",
        name: "CBC",
        priority: "routine",
        category: "Lab",
      },
      {
        id: "os-adm-2",
        name: "CMP",
        priority: "routine",
        category: "Lab",
      },
      {
        id: "os-adm-3",
        name: "Vitals q4h",
        priority: "routine",
        category: "Nursing",
      },
    ],
  },
];

const patientOrderSetMap: Record<string, string[]> = {
  p1: ["os-chf"],
  p2: ["os-sepsis"],
  p3: ["os-asthma"],
  p4: ["os-admission"],
};

export function getOrderSetsByPatientId(patientId: string): OrderSet[] {
  const setIds = patientOrderSetMap[patientId] ?? [];
  return mockOrderSets.filter((orderSet) => setIds.includes(orderSet.id));
}

export function getOrderSetsForCriticalVitals(patientId: string): OrderSet[] {
  if (patientId === "p2") {
    return getOrderSetsByPatientId(patientId);
  }
  return [];
}
