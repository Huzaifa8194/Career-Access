import { PortalShell } from "@/components/portal/PortalShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Inbox" };

const threads = [
  {
    from: "Jordan Hayes",
    pathway: "College + FAFSA",
    preview:
      "Sounds great. I'll bring my tax forms — anything else I should prep?",
    time: "1h ago",
    unread: true,
  },
  {
    from: "Aaliyah Carter",
    pathway: "Short-term training",
    preview: "Confirming Tuesday at 2pm. I've already filed for childcare aid.",
    time: "3h ago",
    unread: true,
  },
  {
    from: "Tomás Alvarez",
    pathway: "Apprenticeship",
    preview: "Hi Maya — quick question on the union math test, do you have…",
    time: "Yesterday",
    unread: false,
  },
  {
    from: "Renée Brooks",
    pathway: "Enrolled",
    preview: "First class went well! Thanks for the prep last week.",
    time: "2d ago",
    unread: false,
  },
];

export default function AdvisorInboxPage() {
  return (
    <PortalShell
      role="advisor"
      title="Inbox"
      subtitle="Direct messages from your active participants."
    >
      <Card className="overflow-hidden">
        <CardHeader
          title="Threads"
          description="Sorted by most recent"
          action={
            <Badge tone="warn">
              {threads.filter((t) => t.unread).length} unread
            </Badge>
          }
        />
        <CardBody className="p-0">
          <ul className="divide-y divide-line">
            {threads.map((t) => (
              <li
                key={t.from}
                className="flex items-start gap-4 p-5 hover:bg-canvas/40 cursor-pointer"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white text-[12px] font-semibold">
                  {t.from
                    .split(" ")
                    .map((s) => s[0])
                    .join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[14px] font-medium text-ink">
                      {t.from}
                    </span>
                    <span className="text-[12px] text-ink-subtle">{t.time}</span>
                  </div>
                  <div className="text-[12px] text-ink-subtle">{t.pathway}</div>
                  <p className="mt-1 text-[14px] text-ink-muted line-clamp-1">
                    {t.preview}
                  </p>
                </div>
                {t.unread && (
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />
                )}
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </PortalShell>
  );
}
