import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";
import { uploadFile } from "@/lib/firebase/storage";
import { fetchMyParticipant } from "./participants";

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
  const ref = await addDoc(collection(getFirebaseDb(), "documents"), {
    participantId,
    fileName: stored.fileName,
    fileUrl: stored.fileUrl,
    storagePath: stored.storagePath,
    sizeBytes: stored.sizeBytes,
    status,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, stored, live: true };
}

export async function fetchMyDocuments(): Promise<{
  rows: DocumentRow[];
  live: boolean;
}> {
  const participant = await fetchMyParticipant();
  if (!participant?._live) return { rows: [], live: false };
  const snap = await getDocs(
    query(
      collection(getFirebaseDb(), "documents"),
      where("participantId", "==", participant.id),
      orderBy("createdAt", "desc")
    )
  );
  return {
    rows: snap.docs.map((d) => {
      const row = d.data() as {
        fileName: string;
        fileUrl: string;
        sizeBytes?: number | null;
        status?: string;
        createdAt?: Timestamp | Date | string;
      };
      const createdAt =
        row.createdAt instanceof Date
          ? row.createdAt.toISOString()
          : typeof row.createdAt === "string"
            ? row.createdAt
            : row.createdAt?.toDate().toISOString() ?? new Date().toISOString();
      return {
        id: d.id,
        fileName: row.fileName,
        fileUrl: row.fileUrl,
        sizeBytes: row.sizeBytes ?? null,
        status: row.status ?? "in-review",
        createdAt,
      };
    }),
    live: true,
  };
}

export async function mutateDocumentStatus(id: string, status: string) {
  await updateDoc(doc(getFirebaseDb(), "documents", id), {
    status,
    updatedAt: serverTimestamp(),
  });
  return { error: null, live: true };
}
