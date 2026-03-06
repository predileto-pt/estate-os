"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";

export async function approveAgendamento(id: string) {
  const supabase = await createClient();

  const { data: agendamento } = await supabase
    .from("agendamentos")
    .select("*")
    .eq("id", id)
    .single();

  if (!agendamento) return;

  await supabase
    .from("agendamentos")
    .update({
      status: "approved",
      resolved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  await resend.emails.send({
    from: "Predileto <noreply@predileto.pt>",
    to: agendamento.visitor_email,
    subject: "Visita Aprovada - Predileto",
    html: `
      <h2>Parabéns, ${agendamento.visitor_name}!</h2>
      <p>A sua visita ao imóvel <strong>${agendamento.property_title}</strong> foi aprovada.</p>
      <p>A imobiliária entrará em contacto consigo brevemente para agendar a visita.</p>
      <p>Obrigado por utilizar o Predileto.</p>
    `,
  });

  revalidatePath("/");
}

export async function rejectAgendamento(id: string) {
  const supabase = await createClient();

  const { data: agendamento } = await supabase
    .from("agendamentos")
    .select("*")
    .eq("id", id)
    .single();

  if (!agendamento) return;

  await supabase
    .from("agendamentos")
    .update({
      status: "rejected",
      resolved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  await resend.emails.send({
    from: "Predileto <noreply@predileto.pt>",
    to: agendamento.visitor_email,
    subject: "Atualização sobre a sua visita - Predileto",
    html: `
      <h2>Olá, ${agendamento.visitor_name}</h2>
      <p>Lamentamos informar que o seu pedido de visita ao imóvel <strong>${agendamento.property_title}</strong> não foi aprovado desta vez.</p>
      <p>Possíveis razões:</p>
      <ul>
        <li>Documentação incompleta (documento de identificação ou comprovativo de rendimentos em falta)</li>
        <li>O imóvel pode já não estar disponível</li>
      </ul>
      <p>Encorajamos a tentar novamente com a documentação completa.</p>
      <p>Obrigado por utilizar o Predileto.</p>
    `,
  });

  revalidatePath("/");
}
