import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { getPostHogServer } from "@/lib/posthog-server";

export async function POST(request: NextRequest) {
  const { visitorName, visitorEmail, propertyTitle } = await request.json();

  const { error } = await resend.emails.send({
    from: "Predileto <noreply@predileto.pt>",
    to: visitorEmail,
    subject: "Visita Aprovada - Predileto",
    html: `
      <h2>Parabéns, ${visitorName}!</h2>
      <p>A sua visita ao imóvel <strong>${propertyTitle}</strong> foi aprovada.</p>
      <p>A imobiliária entrará em contacto consigo brevemente para agendar a visita.</p>
      <p>Obrigado por utilizar o Predileto.</p>
    `,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const posthog = getPostHogServer();
  posthog.capture({
    distinctId: visitorEmail,
    event: "visit_approval_email_sent",
    properties: { property_title: propertyTitle },
  });
  await posthog.flush();

  return NextResponse.json({ success: true });
}
