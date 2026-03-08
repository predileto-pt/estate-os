"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";

const APPLICANT_INTAKE_FORM_URL =
  process.env.APPLICANT_INTAKE_FORM_URL || "http://localhost:5173";

export async function createIntakeFormRequest(formData: {
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  property_id: string;
  property_title?: string;
  property_price?: number | null;
  property_address?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("intake_form_requests")
    .insert({
      agency_id: user.id,
      applicant_name: formData.applicant_name,
      applicant_email: formData.applicant_email,
      applicant_phone: formData.applicant_phone || null,
      property_id: formData.property_id,
      property_title: formData.property_title || null,
      property_price: formData.property_price ?? null,
      property_address: formData.property_address || null,
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "Insert failed" };

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

  revalidatePath("/");
  return { success: true };
}

export async function resendIntakeFormEmail(requestId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: request } = await supabase
    .from("intake_form_requests")
    .select("*")
    .eq("id", requestId)
    .eq("agency_id", user.id)
    .single();

  if (!request) return { error: "Request not found" };

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

  return { success: true };
}
