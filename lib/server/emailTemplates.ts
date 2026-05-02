function shell(content: string): string {
  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <div style="max-width: 640px; margin: 0 auto; padding: 24px;">
        <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
          ${content}
        </div>
        <p style="font-size: 12px; color: #6b7280; margin-top: 16px;">
          Career Access Hub
        </p>
      </div>
    </div>
  `;
}

export function applicationApplicantTemplate(input: {
  firstName: string;
  referenceId: string;
  pathway: string;
}): { subject: string; html: string } {
  return {
    subject: "Application received - Career Access Hub",
    html: shell(`
      <h2 style="margin: 0 0 12px;">Thanks, ${input.firstName} - your application is in.</h2>
      <p style="margin: 0 0 12px;">We received your application and our team will review it shortly.</p>
      <p style="margin: 0 0 12px;"><strong>Reference ID:</strong> ${input.referenceId}</p>
      <p style="margin: 0 0 12px;"><strong>Suggested pathway:</strong> ${input.pathway}</p>
      <p style="margin: 0;">An advisor will follow up within 2 business days.</p>
    `),
  };
}

export function internalAlertTemplate(input: {
  title: string;
  lines: string[];
}): { subject: string; html: string } {
  const details = input.lines
    .map((line) => `<li style="margin: 0 0 6px;">${line}</li>`)
    .join("");
  return {
    subject: input.title,
    html: shell(`
      <h2 style="margin: 0 0 12px;">${input.title}</h2>
      <ul style="padding-left: 20px; margin: 0;">${details}</ul>
    `),
  };
}

export function contactAutoReplyTemplate(input: {
  name: string;
}): { subject: string; html: string } {
  return {
    subject: "We received your message - Career Access Hub",
    html: shell(`
      <h2 style="margin: 0 0 12px;">Hi ${input.name},</h2>
      <p style="margin: 0 0 12px;">Thanks for contacting Career Access Hub. A team member will respond within two business days.</p>
      <p style="margin: 0;">If your request is urgent, please call us at 908-652-4653.</p>
    `),
  };
}

export function referralThankYouTemplate(input: {
  referrerName: string;
  applicantName: string;
}): { subject: string; html: string } {
  return {
    subject: "Referral received - Career Access Hub",
    html: shell(`
      <h2 style="margin: 0 0 12px;">Thank you, ${input.referrerName}.</h2>
      <p style="margin: 0 0 12px;">We received your referral for <strong>${input.applicantName}</strong>.</p>
      <p style="margin: 0;">Our team will begin outreach within 2 business days and keep your organization informed as appropriate.</p>
    `),
  };
}

export function appointmentConfirmationTemplate(input: {
  name: string;
  date: string;
  time: string;
  timezone: string;
  appointmentType: string;
}): { subject: string; html: string } {
  return {
    subject: "Appointment confirmed - Career Access Hub",
    html: shell(`
      <h2 style="margin: 0 0 12px;">You're booked, ${input.name}.</h2>
      <p style="margin: 0 0 12px;">Your advising call is confirmed.</p>
      <p style="margin: 0 0 6px;"><strong>Type:</strong> ${input.appointmentType}</p>
      <p style="margin: 0 0 6px;"><strong>Date:</strong> ${input.date}</p>
      <p style="margin: 0 0 12px;"><strong>Time:</strong> ${input.time} ${input.timezone}</p>
      <p style="margin: 0;">Need to change your time? Reply to this email and our team will help.</p>
    `),
  };
}
