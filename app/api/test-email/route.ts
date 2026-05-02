import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const FROM_EMAIL = "info@njcareerhub.com";
const TEST_RECIPIENT = "huzaifa8195@gmail.com";

export async function POST() {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "RESEND_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TEST_RECIPIENT,
      subject: "Career Access Hub - Test Email",
      html: `
        <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
          <h2 style="margin: 0 0 12px;">Test email sent successfully</h2>
          <p style="margin: 0 0 8px;">This confirms your Resend integration is working.</p>
          <p style="margin: 0;">Sent from <strong>${FROM_EMAIL}</strong> to <strong>${TEST_RECIPIENT}</strong>.</p>
        </div>
      `,
      replyTo: FROM_EMAIL,
    });

    return NextResponse.json({ ok: true, id: result.data?.id ?? null });
  } catch (error) {
    console.error("Test email send failed", error);
    return NextResponse.json({ error: "Failed to send test email." }, { status: 500 });
  }
}
