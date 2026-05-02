import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  applicationApplicantTemplate,
  appointmentConfirmationTemplate,
  contactAutoReplyTemplate,
  internalAlertTemplate,
  referralThankYouTemplate,
} from "@/lib/server/emailTemplates";

export const runtime = "nodejs";

type Body = {
  kind?:
    | "application-submitted"
    | "contact-inquiry"
    | "referral-submitted"
    | "appointment-booked";
  payload?: Record<string, unknown>;
};

const TEAM_EMAIL = "info@njcareerhub.com";
const FROM_EMAIL = "info@njcareerhub.com";

function getString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

async function sendEmail(to: string | string[], subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const resend = new Resend(key);
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
    replyTo: TEAM_EMAIL,
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const payload = body.payload ?? {};

    switch (body.kind) {
      case "application-submitted": {
        const firstName = getString(payload.firstName, "there");
        const lastName = getString(payload.lastName);
        const email = getString(payload.email).trim();
        const referenceId = getString(payload.referenceId);
        const pathway = getString(payload.pathway, "To be determined");
        const applicantName = `${firstName} ${lastName}`.trim();

        if (email) {
          const applicantEmail = applicationApplicantTemplate({
            firstName,
            referenceId,
            pathway,
          });
          await sendEmail(email, applicantEmail.subject, applicantEmail.html);
        }

        const teamEmail = internalAlertTemplate({
          title: "New application submitted",
          lines: [
            `Applicant: ${applicantName}`,
            `Email: ${email || "Not provided"}`,
            `Reference: ${referenceId || "Pending"}`,
            `Pathway: ${pathway}`,
          ],
        });
        await sendEmail(TEAM_EMAIL, teamEmail.subject, teamEmail.html);
        break;
      }

      case "contact-inquiry": {
        const name = getString(payload.name, "there");
        const email = getString(payload.email).trim();
        const phone = getString(payload.phone);
        const role = getString(payload.role);
        const message = getString(payload.message);

        if (email) {
          const reply = contactAutoReplyTemplate({ name });
          await sendEmail(email, reply.subject, reply.html);
        }

        const teamEmail = internalAlertTemplate({
          title: "New contact inquiry",
          lines: [
            `Name: ${name}`,
            `Email: ${email || "Not provided"}`,
            `Phone: ${phone || "Not provided"}`,
            `Role: ${role || "Not specified"}`,
            `Message: ${message || "No message provided"}`,
          ],
        });
        await sendEmail(TEAM_EMAIL, teamEmail.subject, teamEmail.html);
        break;
      }

      case "referral-submitted": {
        const referrerName = getString(payload.referrerName, "Partner");
        const email = getString(payload.email).trim();
        const organizationName = getString(payload.organizationName);
        const applicantFirstName = getString(payload.applicantFirstName);
        const applicantLastName = getString(payload.applicantLastName);
        const applicantEmail = getString(payload.applicantEmail);
        const urgency = getString(payload.urgency);
        const applicantName = `${applicantFirstName} ${applicantLastName}`.trim();

        if (email) {
          const thankYou = referralThankYouTemplate({
            referrerName,
            applicantName,
          });
          await sendEmail(email, thankYou.subject, thankYou.html);
        }

        const teamEmail = internalAlertTemplate({
          title: "New referral submitted",
          lines: [
            `Referrer: ${referrerName}`,
            `Organization: ${organizationName || "Not provided"}`,
            `Referrer email: ${email || "Not provided"}`,
            `Applicant: ${applicantName}`,
            `Applicant email: ${applicantEmail || "Not provided"}`,
            `Urgency: ${urgency || "Standard"}`,
          ],
        });
        await sendEmail(TEAM_EMAIL, teamEmail.subject, teamEmail.html);
        break;
      }

      case "appointment-booked": {
        const name = getString(payload.name, "there");
        const email = getString(payload.email).trim();
        const date = getString(payload.date);
        const time = getString(payload.time);
        const timezone = getString(payload.timezone, "ET");
        const appointmentType = getString(payload.appointmentType, "Advising call");

        if (email) {
          const confirmation = appointmentConfirmationTemplate({
            name,
            date,
            time,
            timezone,
            appointmentType,
          });
          await sendEmail(email, confirmation.subject, confirmation.html);
        }

        const teamEmail = internalAlertTemplate({
          title: "New advising appointment booked",
          lines: [
            `Name: ${name}`,
            `Email: ${email || "Not provided"}`,
            `Type: ${appointmentType}`,
            `Date/Time: ${date} ${time} ${timezone}`,
          ],
        });
        await sendEmail(TEAM_EMAIL, teamEmail.subject, teamEmail.html);
        break;
      }

      default:
        return NextResponse.json(
          { error: "Unsupported notification type." },
          { status: 400 }
        );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Notification email error", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
