import { ClipboardList } from "lucide-react";

import { ClinicalHeader } from "@/components/clinical/clinical-header";
import { ClinicalNoteSummary } from "@/components/clinical/clinical-note-summary";
import { EmptyState } from "@/components/clinical/empty-state";
import { ProgressiveVitals } from "@/components/clinical/progressive-vitals";
import { SidecarShell } from "@/components/clinical/sidecar-shell";
import { SmartOrderSet } from "@/components/clinical/smart-order-set";
import { getPatientContext } from "@/lib/fhir/get-patient-context";
import { mockPatients } from "@/lib/fhir/mock/patients";

interface HomePageProps {
  searchParams: Promise<{ patient?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const patientId = params.patient ?? "p1";
  const context = await getPatientContext(patientId);

  const patientOptions = mockPatients.map(({ id, name }) => ({ id, name }));
  const applicableOrderSet = context.orderSets[0] ?? null;

  return (
    <div className="flex min-h-dvh flex-col md:min-h-screen md:flex-row">
      {/* Legacy EHR placeholder */}
      <div className="relative flex flex-1 items-center justify-center bg-zinc-200/80 p-8">
        <p className="select-none text-center text-lg font-medium text-zinc-500/80">
          Legacy EHR View (Placeholder)
        </p>
      </div>

      <SidecarShell>
        <ClinicalHeader
          patient={context.patient}
          allergies={context.allergies}
          patients={patientOptions}
        />

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-4 pb-10 [-webkit-overflow-scrolling:touch]">
          <div className="flex flex-col gap-4">
            <ProgressiveVitals
              latestVitals={context.latestVitals}
              vitalsHistory={context.vitals}
            />

            {applicableOrderSet ? (
              <SmartOrderSet
                key={applicableOrderSet.id}
                orderSet={applicableOrderSet}
              />
            ) : (
              <EmptyState
                icon={ClipboardList}
                title="No context-specific orders"
                description="No order set matches this patient's current clinical context. Manual ordering is available in the legacy EHR."
              />
            )}

            <ClinicalNoteSummary
              noteId={context.note?.id ?? ""}
              hasNote={context.note !== null}
            />
          </div>
        </div>
      </SidecarShell>
    </div>
  );
}
