"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";
import { getPostHogServer } from "@/lib/posthog-server";

const APPLICANT_INTAKE_FORM_URL =
  process.env.APPLICANT_INTAKE_FORM_URL || "http://localhost:5173";

export async function createIntakeFormRequest(formData: {
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  property_id: string;
  property_type: string;
  listing_type: string;
  property_title?: string;
  property_price?: number | null;
  property_address?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const serviceUrl = process.env.APPLICANTS_MANAGEMENT_SERVICE_URL;
  if (!serviceUrl) return { error: "Service URL not configured" };

  let data: { id: string };
  try {
    const response = await fetch(`${serviceUrl}/api/v1/intake-form-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agency_id: user.id,
        applicant_name: formData.applicant_name,
        applicant_email: formData.applicant_email,
        applicant_phone: formData.applicant_phone || null,
        property_id: formData.property_id,
        property_type: formData.property_type,
        listing_type: formData.listing_type,
        property_title: formData.property_title || null,
        property_price: formData.property_price ?? null,
        property_address: formData.property_address || null,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return { error: errorBody };
    }

    data = await response.json();
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
    distinctId: user.id,
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
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const serviceUrl = process.env.APPLICANTS_MANAGEMENT_SERVICE_URL;
  if (!serviceUrl) return { error: "Service URL not configured" };

  let request: { id: string; applicant_name: string; applicant_email: string; agency_id: string };
  try {
    const response = await fetch(
      `${serviceUrl}/api/v1/intake-form-requests/${requestId}`
    );
    if (!response.ok) return { error: "Request not found" };
    request = await response.json();
  } catch {
    return { error: "Failed to fetch request" };
  }

  if (request.agency_id !== user.id) return { error: "Request not found" };

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
    distinctId: user.id,
    event: "intake_form_email_resent",
    properties: { request_id: requestId },
  });
  await posthog.flush();

  return { success: true };
}
