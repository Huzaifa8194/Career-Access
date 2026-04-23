import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { documentsCol } from "@/lib/firebase/firestore";
import { getFirebaseDb, getFirebaseStorage } from "@/lib/firebase/config";
import {
  COLLECTIONS,
  type DocumentDoc,
  type DocumentStatus,
  toDateISO,
} from "@/lib/firebase/types";

export type DocumentRow = {
  id: string;
  participantId: string;
  fileName: string;
  fileUrl: string;
  storagePath: string;
  size: number | null;
  status: DocumentStatus;
  uploadedBy: string;
  createdAtISO: string | null;
};

function mapDoc(id: string, data: DocumentDoc): DocumentRow {
  return {
    id,
    participantId: data.participantId,
    fileName: data.fileName,
    fileUrl: data.fileUrl,
    storagePath: data.storagePath,
    size: data.size ?? null,
    status: (data.status ?? "in-review") as DocumentStatus,
    uploadedBy: data.uploadedBy,
    createdAtISO: toDateISO(data.createdAt),
  };
}

export async function fetchDocumentsForParticipant(
  participantId: string
): Promise<DocumentRow[]> {
  const snap = await getDocs(
    query(documentsCol(), where("participantId", "==", participantId))
  );
  const rows = snap.docs.map((d) => mapDoc(d.id, d.data() as DocumentDoc));
  rows.sort((a, b) => (b.createdAtISO ?? "").localeCompare(a.createdAtISO ?? ""));
  return rows;
}

export function subscribeDocumentsForParticipant(
  participantId: string,
  cb: (rows: DocumentRow[]) => void
): Unsubscribe {
  return onSnapshot(
    query(documentsCol(), where("participantId", "==", participantId)),
    (snap) => {
      const rows = snap.docs.map((d) => mapDoc(d.id, d.data() as DocumentDoc));
      rows.sort((a, b) =>
        (b.createdAtISO ?? "").localeCompare(a.createdAtISO ?? "")
      );
      cb(rows);
    },
    () => cb([])
  );
}

function safeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

export async function uploadParticipantDocument(
  participantId: string,
  file: File,
  uploadedBy: string
): Promise<DocumentRow> {
  const storage = getFirebaseStorage();
  const path = `participants/${participantId}/${Date.now()}_${safeFileName(file.name)}`;
  const sref = storageRef(storage, path);
  await uploadBytes(sref, file, { contentType: file.type || undefined });
  const url = await getDownloadURL(sref);

  const data: DocumentDoc = {
    participantId,
    fileName: file.name,
    fileUrl: url,
    storagePath: path,
    mimeType: file.type || null,
    size: file.size,
    uploadedBy,
    status: "in-review",
    createdAt: serverTimestamp() as unknown as DocumentDoc["createdAt"],
  };
  const ref = await addDoc(documentsCol(), data);
  return {
    id: ref.id,
    participantId,
    fileName: file.name,
    fileUrl: url,
    storagePath: path,
    size: file.size,
    status: "in-review",
    uploadedBy,
    createdAtISO: new Date().toISOString(),
  };
}

export async function updateDocumentStatus(
  id: string,
  status: DocumentStatus
): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), COLLECTIONS.documents, id), { status });
}

export async function deleteDocument(
  id: string,
  storagePath: string
): Promise<void> {
  try {
    const sref = storageRef(getFirebaseStorage(), storagePath);
    await deleteObject(sref);
  } catch {
  }
  await deleteDoc(doc(getFirebaseDb(), COLLECTIONS.documents, id));
}
