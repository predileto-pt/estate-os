import { Suspense } from "react";
import { getOrganizationId } from "@/lib/api/auth";
import { ApplicantsPolling } from "./components/applicants-polling";
import { fetchApplicants } from "./actions";

export default async function CandidatosPage() {
  const organizationId = await getOrganizationId();

  if (!organizationId) return null;

  const result = await fetchApplicants(organizationId);
  const applicants = result.error === null ? result.data : [];

  return (
    <Suspense>
      <ApplicantsPolling
        organizationId={organizationId}
        initialApplicants={applicants}
      />
    </Suspense>
  );
}
