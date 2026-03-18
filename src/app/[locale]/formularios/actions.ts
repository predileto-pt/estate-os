"use server";

import { revalidatePath } from "next/cache";
import { resend } from "@/lib/resend";
import { getPostHogServer } from "@/lib/posthog-server";
import {
  applicantsPost,
  applicantsGet,
} from "@/lib/api/applicants-client";
import { getAuthContext } from "@/lib/api/auth";

const APPLICANT_INTAKE_FORM_URL =
  process.env.APPLICANT_INTAKE_FORM_URL || "http://localhost:5173";

export async function createIntakeFormRequest(formData: {
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  property_id: string;
  property_type?: string;
  listing_type?: string;
  property_title?: string;
  property_price?: number | null;
  property_address?: string;
}) {
  let authCtx: Awaited<ReturnType<typeof getAuthContext>>;
  try {
    authCtx = await getAuthContext();
  } catch {
    return { error: "Not authenticated" };
  }

  const { organizationId } = authCtx;

  let data: { id: string };
  try {
    data = await applicantsPost<{ id: string }>(
      "/api/v1/intake-form-requests",
      {
        organization_id: organizationId,
        applicant_name: formData.applicant_name,
        applicant_email: formData.applicant_email,
        applicant_phone: formData.applicant_phone || null,
        property_id: formData.property_id,
        property_type: formData.property_type || null,
        listing_type: formData.listing_type || null,
        property_title: formData.property_title || null,
        property_price: formData.property_price ?? null,
        property_address: formData.property_address || null,
      },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }

  const link = `${APPLICANT_INTAKE_FORM_URL}/${data.id}`;

  await resend.emails.send({
    from: "Predileto <noreply@predileto.pt>",
    to: formData.applicant_email,
    subject: "Formulário de Candidatura - Predileto",
    html: `
      <h2>Olá, ${formData.applicant_name}!</h2>
      <p>Foi convidado(a) a preencher um formulário de candidatura.</p>
      <p><a href="${link}">Clique aqui para preencher o formulário</a></p>
      <p>Obrigado por utilizar o Predileto.</p>
    `,
  });

  const posthog = getPostHogServer();
  posthog.capture({
    distinctId: organizationId,
    event: "intake_form_request_created",
    properties: {
      property_id: formData.property_id,
      property_type: formData.property_type,
      listing_type: formData.listing_type,
    },
  });
  await posthog.flush();

  revalidatePath("/");
  return { success: true };
}

export async function resendIntakeFormEmail(requestId: string) {
  let authCtx: Awaited<ReturnType<typeof getAuthContext>>;
  try {
    authCtx = await getAuthContext();
  } catch {
    return { error: "Not authenticated" };
  }

  const { organizationId } = authCtx;

  let request: {
    id: string;
    applicant_name: string;
    applicant_email: string;
    organization_id: string;
  };
  try {
    request = await applicantsGet<typeof request>(
      `/api/v1/intake-form-requests/${requestId}`,
    );
  } catch {
    return { error: "Request not found" };
  }

  if (request.organization_id !== organizationId) return { error: "Request not found" };

  const link = `${APPLICANT_INTAKE_FORM_URL}/${request.id}`;

  await resend.emails.send({
    from: "Predileto <noreply@predileto.pt>",
    to: request.applicant_email,
    subject: "Formulário de Candidatura - Predileto",
    html: `
      <h2>Olá, ${request.applicant_name}!</h2>
      <p>Foi convidado(a) a preencher um formulário de candidatura.</p>
      <p><a href="${link}">Clique aqui para preencher o formulário</a></p>
      <p>Obrigado por utilizar o Predileto.</p>
    `,
  });

  const posthog = getPostHogServer();
  posthog.capture({
    distinctId: organizationId,
    event: "intake_form_email_resent",
    properties: { request_id: requestId },
  });
  await posthog.flush();

  return { success: true };
}
