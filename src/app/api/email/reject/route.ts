import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(request: NextRequest) {
  const { visitorName, visitorEmail, propertyTitle } = await request.json();

  const { error } = await resend.emails.send({
    from: "Predileto <noreply@predileto.pt>",
    to: visitorEmail,
    subject: "Atualização sobre a sua visita - Predileto",
    html: `
      <h2>Olá, ${visitorName}</h2>
      <p>Lamentamos informar que o seu pedido de visita ao imóvel <strong>${propertyTitle}</strong> não foi aprovado desta vez.</p>
      <p>Possíveis razões:</p>
      <ul>
        <li>Documentação incompleta (documento de identificação ou comprovativo de rendimentos em falta)</li>
        <li>O imóvel pode já não estar disponível</li>
      </ul>
      <p>Encorajamos a tentar novamente com a documentação completa.</p>
      <p>Obrigado por utilizar o Predileto.</p>
    `,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
