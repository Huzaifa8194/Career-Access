import {
  createDocument,
  listMyDocuments,
  updateDocumentStatus,
} from "@dataconnect/generated";
import { callDC } from "@/lib/firebase/dataconnect";
import { uploadFile } from "@/lib/firebase/storage";

export type DocumentRow = {
  id: string;
  fileName: string;
  fileUrl: string;
  sizeBytes?: number | null;
  status: string;
  createdAt: string;
};

export async function uploadParticipantDocument({
  file,
  participantId,
  status = "in-review",
}: {
  file: File;
  participantId: string;
  status?: string;
}) {
  const stored = await uploadFile(file, `participants/${participantId}`);
  const { data, live } = await callDC(
    () =>
      createDocument({
        participantId,
        fileName: stored.fileName,
        fileUrl: stored.fileUrl,
        storagePath: stored.storagePath,
        sizeBytes: stored.sizeBytes,
        status,
      }),
    { label: "createDocument" }
  );
  const id =
    (data as { document_insert?: { id: string } } | null)?.document_insert?.id ?? null;
  return { id, stored, live };
}

export async function fetchMyDocuments(): Promise<{
  rows: DocumentRow[];
  live: boolean;
}> {
  const { data, live } = await callDC(() => listMyDocuments(), {
    label: "listMyDocuments",
  });
  return {
    rows:
      ((data as { documents?: DocumentRow[] } | null)?.documents ?? []).map(
        (r) => ({ ...r })
      ),
    live,
  };
}

export async function mutateDocumentStatus(id: string, status: string) {
  return callDC(() => updateDocumentStatus({ id, status }), {
    label: "updateDocumentStatus",
  });
}
