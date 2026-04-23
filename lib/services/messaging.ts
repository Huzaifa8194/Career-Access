import {
  createNote,
  listMyMessages,
  listParticipantMessages,
  markMessageRead,
  sendMessage,
} from "@dataconnect/generated";
import { callDC } from "@/lib/firebase/dataconnect";

export type MessageRow = {
  id: string;
  message: string;
  senderRole: string;
  read: boolean;
  createdAt: string;
  sender: { id: string; fullName: string } | null;
};

export async function fetchMyMessages(): Promise<{
  rows: MessageRow[];
  live: boolean;
}> {
  const { data, live } = await callDC(() => listMyMessages(), {
    label: "listMyMessages",
  });
  return {
    rows: ((data as { messages?: MessageRow[] } | null)?.messages ?? []).map((r) => ({
      ...r,
    })),
    live,
  };
}

export async function fetchParticipantThread(participantId: string): Promise<{
  rows: MessageRow[];
  live: boolean;
}> {
  const { data, live } = await callDC(
    () => listParticipantMessages({ participantId }),
    { label: "listParticipantMessages" }
  );
  return {
    rows: ((data as { messages?: MessageRow[] } | null)?.messages ?? []).map((r) => ({
      ...r,
    })),
    live,
  };
}

export async function sendParticipantMessage({
  participantId,
  message,
  senderRole,
}: {
  participantId: string;
  message: string;
  senderRole: "participant" | "advisor" | "admin";
}) {
  return callDC(
    () => sendMessage({ participantId, message, senderRole }),
    { label: "sendMessage" }
  );
}

export async function markRead(id: string) {
  return callDC(() => markMessageRead({ id }), { label: "markMessageRead" });
}

export async function createCaseNote({
  participantId,
  content,
  kind,
}: {
  participantId: string;
  content: string;
  kind?: string;
}) {
  return callDC(
    () => createNote({ participantId, content, kind: kind ?? "note" }),
    { label: "createNote" }
  );
}
